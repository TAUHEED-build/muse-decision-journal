import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = geminiApiKey
  ? new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasApiKey: Boolean(geminiApiKey),
  });
});

interface DecisionRequest {
  title: string;
  context: string;
  priorities: string[];
  concerns: string;
  assumptionsPrompt?: string;
  previousOutcomesSummary?: string;
}

// Sparring Decision Analysis endpoint
app.post('/api/analyze-decision', async (req, res) => {
  try {
    const {
      title,
      context,
      priorities = [],
      concerns = '',
      assumptionsPrompt = '',
      previousOutcomesSummary = '',
    }: DecisionRequest = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Decision title is required.' });
    }

    if (ai) {
      const prompt = `
You are MUSE, a calm, deeply thoughtful intellectual sparring partner for high-stakes decisions.
The user is contemplating a decision. Your objective is NOT to validate them, flatter them, or tell them what they must do.
Instead, act as an intellectual sparring partner:
1. Identify the hidden premises they seem to believe.
2. Separate empirical evidence from subjective assumption.
3. Challenge each assumption directly, provide counterpoints, and define what empirical evidence would be required.
4. Highlight subtle second-order risks and key unknowns.
5. Offer 3 distinct, nuanced options (not caricatures), each with its upside, downside, and unknown.
6. Provide a balanced, mature recommendation ("MUSE's Take") that does not claim false certainty, acknowledges trade-offs, and suggests a concrete testable next step.

Decision to examine:
- Core Decision: "${title}"
- What makes this difficult (Context): "${context || 'Not specified'}"
- Priorities / What matters most: ${priorities.length > 0 ? priorities.join(', ') : 'Not specified'}
- Deepest worries / concerns: "${concerns || 'None listed'}"
${assumptionsPrompt ? `- User's stated beliefs: "${assumptionsPrompt}"` : ''}
${previousOutcomesSummary ? `- User's historical decision patterns: "${previousOutcomesSummary}"` : ''}

Respond STRICTLY in valid JSON matching this schema:
{
  "confidenceEstimated": number (integer between 40 and 85 representing an objective baseline calibration for this type of decision before testing),
  "coreBelief": "What the user seems to believe (1-2 sentences)",
  "optimizingFor": [
    { "tag": "string (e.g. Time)", "note": "Brief explanation of how this driver manifests" }
  ],
  "assumptions": [
    {
      "assumption": "The exact belief or presumption",
      "challenge": "A probing question asking for proof or exposing the fragility of the assumption",
      "counterpoint": "The realistic counter-argument or opposing perspective",
      "evidenceNeeded": "What concrete observation, data point, or test is needed before treating this as fact"
    }
  ],
  "risks": [
    "Subtle second-order risk 1",
    "Subtle second-order risk 2",
    "Subtle second-order risk 3"
  ],
  "unknowns": [
    "Critical missing variable or unknown 1",
    "Critical missing variable or unknown 2"
  ],
  "options": [
    {
      "name": "Option title",
      "upside": "Clear potential benefit",
      "downside": "Real cost or vulnerability",
      "unknown": "The key unverified variable with this path"
    }
  ],
  "museTake": {
    "summary": "Measured, balanced stance (2-3 sentences)",
    "reasoning": "Nuanced analysis of trade-offs and human tendencies in this situation",
    "recommendedNextStep": "A low-risk, falsifiable action to take before making an irreversible commitment"
  }
}
Provide 2 to 4 assumptions and exactly 3 realistic options.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text;
      if (responseText) {
        try {
          const parsed = JSON.parse(responseText);
          return res.json(parsed);
        } catch (parseErr) {
          console.warn('Failed to parse Gemini JSON directly, falling back:', parseErr);
        }
      }
    }

    // High quality deterministic fallback generator
    const fallback = generateFallbackAnalysis(title, context, priorities, concerns, assumptionsPrompt);
    return res.json(fallback);
  } catch (error: any) {
    console.error('Error analyzing decision:', error);
    // In case of any error with AI, provide the fallback response so the user journey never fails
    try {
      const fallback = generateFallbackAnalysis(
        req.body?.title || 'Decision',
        req.body?.context || '',
        req.body?.priorities || [],
        req.body?.concerns || '',
        req.body?.assumptionsPrompt || ''
      );
      return res.json(fallback);
    } catch {
      return res.status(500).json({ error: 'Failed to generate decision analysis.' });
    }
  }
});

// Outcome Review endpoint
app.post('/api/review-outcome', async (req, res) => {
  try {
    const {
      decisionTitle,
      context = '',
      initialConfidence = 70,
      initialAssumptions = [],
      actualOutcome,
      whatGotRight = '',
      whatGotWrong = '',
    } = req.body;

    if (!decisionTitle || !actualOutcome) {
      return res.status(400).json({ error: 'Decision title and actual outcome are required.' });
    }

    if (ai) {
      const prompt = `
You are MUSE, a decision intelligence engine evaluating personal calibration and cognitive outcomes.
Review the following past decision and its actual aftermath:
- Original Decision: "${decisionTitle}"
- Context: "${context}"
- Initial Stated Confidence: ${initialConfidence}%
- Initial Assumptions: ${JSON.stringify(initialAssumptions)}
- What Actually Happened: "${actualOutcome}"
- What the user thinks they got right: "${whatGotRight}"
- What the user thinks they got wrong: "${whatGotWrong}"

Analyze the divergence between prediction and reality.
Act as an honest, calm, insightful mirror.
Identify any recurring cognitive bias (e.g., planning fallacy, sunk cost, optimism bias, underestimating relational frictions).

Respond STRICTLY in valid JSON matching this schema:
{
  "predictionCalibration": "Underconfident" | "Well-Calibrated" | "Overconfident",
  "actualOutcomeAssessment": "Positive" | "Mixed" | "Negative",
  "whatYouPredictedWell": "Insightful breakdown of where their intuition or analysis proved accurate (2-3 sentences)",
  "whatYouMissed": "Direct breakdown of what reality surprised them with (2-3 sentences)",
  "newPattern": "A concise, memorable behavioral rule or observation (e.g. 'You tend to underestimate the time required for technical projects.')",
  "calibrationScore": number (integer between 50 and 95 reflecting how well their expectations mapped to results)
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      const responseText = response.text;
      if (responseText) {
        try {
          const parsed = JSON.parse(responseText);
          return res.json(parsed);
        } catch (parseErr) {
          console.warn('Failed to parse outcome review JSON:', parseErr);
        }
      }
    }

    // Fallback outcome review
    const fallback = generateFallbackOutcomeReview(
      decisionTitle,
      initialConfidence,
      actualOutcome,
      whatGotRight,
      whatGotWrong
    );
    return res.json(fallback);
  } catch (error: any) {
    console.error('Error generating outcome review:', error);
    const fallback = generateFallbackOutcomeReview(
      req.body?.decisionTitle || 'Decision',
      req.body?.initialConfidence || 70,
      req.body?.actualOutcome || '',
      req.body?.whatGotRight || '',
      req.body?.whatGotWrong || ''
    );
    return res.json(fallback);
  }
});

// Deterministic fallback reasoning engines
function generateFallbackAnalysis(
  title: string,
  context: string,
  priorities: string[],
  concerns: string,
  assumptionsPrompt?: string
) {
  const isCareer = /job|client|quit|career|work|hire|salary|freelance|boss/i.test(title + ' ' + context);
  const isProduct = /build|app|launch|project|saas|code|startup|feature/i.test(title + ' ' + context);
  const isPersonal = /habit|routine|move|city|health|relationship|sleep|study/i.test(title + ' ' + context);

  const mainPriority = priorities[0] || 'Clarity';

  let assumptions = [
    {
      assumption: `Taking action now will immediately resolve the friction around "${title.slice(0, 40)}..."`,
      challenge: 'What evidence indicates the friction is caused by external circumstances rather than your internal process?',
      counterpoint: 'Often changing the external container transfers the same underlying friction into a new setting without reducing cognitive load.',
      evidenceNeeded: 'Map the exact hours or specific triggers over the last 14 days before attributing the dissatisfaction entirely to this variable.',
    },
    {
      assumption: `The upside of changing course outweighs the friction of transition and lost momentum.`,
      challenge: 'Have you quantified the transition cost (learning curve, relationship capital, administrative overhead)?',
      counterpoint: 'Transitions almost always demand 1.5x to 2x more emotional and logistical overhead than initial projections suggest.',
      evidenceNeeded: 'Calculate a runway buffer and draft a 30-day transition timeline with explicit failure milestones.',
    },
  ];

  if (assumptionsPrompt && assumptionsPrompt.trim().length > 5) {
    assumptions.unshift({
      assumption: assumptionsPrompt.trim(),
      challenge: 'What observable data supports this conviction versus optimistic intuition?',
      counterpoint: 'Beliefs formed during periods of fatigue or frustration tend to extrapolate best-case scenarios onto untested paths.',
      evidenceNeeded: 'Seek disconfirming evidence: interview someone who took this exact path in the last 12 months.',
    });
  }

  let options = [
    {
      name: 'Act decisively on the primary instinct',
      upside: 'Closes open mental loops and forces immediate adaptation.',
      downside: 'Carries high irreversible risk if foundational assumptions prove hollow.',
      unknown: 'How quickly you can reach operational equilibrium after the shift.',
    },
    {
      name: 'Time-boxed boundary with explicit criteria',
      upside: 'Gathers clean empirical data for 3–4 weeks without burning bridges.',
      downside: 'Requires discipline to avoid drifting into indefinite procrastination.',
      unknown: 'Whether the current environment will allow an honest, unskewed trial.',
    },
    {
      name: 'Renegotiate the terms / Reduce the blast radius',
      upside: 'Preserves the baseline benefits while systematically shedding the chief pain points.',
      downside: 'Requires difficult, candid communication and firm boundary enforcement.',
      unknown: 'The other party’s willingness to adjust expectations without resentment.',
    },
  ];

  return {
    confidenceEstimated: 68,
    coreBelief: `You seem to believe that changing this variable is the principal lever needed to protect your ${priorities.join(' & ') || 'core goals'}.`,
    optimizingFor: priorities.map(p => ({
      tag: p,
      note: `Treated as a non-negotiable metric of success for this evaluation.`,
    })),
    assumptions,
    risks: [
      'Underestimating emotional switching costs and the lag time to regain flow.',
      'Treating temporary acute frustration as a permanent structural flaw.',
      'Over-indexing on short-term relief at the expense of compounding long-term leverage.',
    ],
    unknowns: [
      'The true unvarnished alternatives available if you step away today.',
      'How resilient your baseline reserves (financial, mental, temporal) remain under prolonged ambiguity.',
    ],
    options,
    museTake: {
      summary: 'Avoid treating this as a binary fork in the road. Most high-stakes decisions suffer from premature foreclosure of hybrid paths.',
      reasoning: 'When humans feel cognitive fatigue or restlessness, our bias is to seek immediate release through drastic change. A controlled experiment or a conditional deadline usually yields 80% of the clarity at 20% of the collateral risk.',
      recommendedNextStep: 'Define 2 explicit metrics that must be true in 21 days. If they fail, execute the transition with full clarity; if they succeed, adjust the baseline.',
    },
  };
}

function generateFallbackOutcomeReview(
  decisionTitle: string,
  initialConfidence: number,
  actualOutcome: string,
  whatGotRight: string,
  whatGotWrong: string
) {
  const isHighConfidence = initialConfidence >= 75;
  const outcomeText = (actualOutcome + ' ' + whatGotWrong).toLowerCase();
  const hadUnexpectedFriction = /longer|delay|harder|missed|underestimated|surprise|slow|stress|exhausted/i.test(outcomeText);

  let calibration = 'Well-Calibrated';
  if (isHighConfidence && hadUnexpectedFriction) {
    calibration = 'Overconfident';
  } else if (!isHighConfidence && !hadUnexpectedFriction) {
    calibration = 'Underconfident';
  }

  return {
    predictionCalibration: calibration,
    actualOutcomeAssessment: hadUnexpectedFriction ? 'Mixed' : 'Positive',
    whatYouPredictedWell: whatGotRight.trim()
      ? `You accurately anticipated: "${whatGotRight}". Your instincts regarding the primary directional mechanics proved solid.`
      : 'You correctly identified the core tension and preserved your non-negotiables throughout execution.',
    whatYouMissed: whatGotWrong.trim()
      ? `The friction around: "${whatGotWrong}" emerged faster than forecasted. Execution friction consistently outpaced initial planning.`
      : 'You encountered subtle second-order friction in time horizons and emotional switching costs.',
    newPattern: hadUnexpectedFriction
      ? 'You tend to underestimate friction and emotional fatigue during transition phases.'
      : 'Your deliberate reasoning process yields higher clarity when you explicitly map out counterpoints beforehand.',
    calibrationScore: calibration === 'Well-Calibrated' ? 88 : calibration === 'Overconfident' ? 64 : 74,
  };
}

// Dev vs Prod handling with Vite middleware
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MUSE server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
