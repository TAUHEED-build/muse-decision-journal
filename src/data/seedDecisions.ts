import { Decision } from '../types/decision';

export const SEED_DECISIONS: Decision[] = [
  {
    id: 'dec-sentinel-os-2026',
    title: 'Continue building Sentinel OS or sunset it for a B2B pivot',
    context:
      'We have spent five months building an open-source security telemetry framework. Developer stars and feedback are encouraging, but zero inbound commercial leads have materialized. Runway is down to 7 months.',
    priorities: ['Growth', 'Stability', 'Time'],
    concerns:
      'Running out of capital before reaching product-market fit; abandoning months of architecture that could compound if given another half-year.',
    initialAssumptions:
      'If developer adoption crosses 2,000 GitHub stars, enterprise security teams will naturally approach us for self-hosted enterprise tiering.',
    status: 'deciding',
    confidence: 61,
    createdAt: '2026-10-04T02:15:00.000Z',
    updatedAt: '2026-10-04T02:15:00.000Z',
    analysis: {
      confidenceEstimated: 61,
      coreBelief:
        'You seem to believe that developer enthusiasm automatically translates into bottom-up enterprise purchasing power without a dedicated outbound sales motion.',
      optimizingFor: [
        {
          tag: 'Growth',
          note: 'Seeking exponential compounding rather than linear consulting or custom feature contracts.',
        },
        {
          tag: 'Stability',
          note: 'Protecting remaining 7-month runway from depleting to zero without verifiable revenue.',
        },
        {
          tag: 'Time',
          note: 'Anxiety over spending another 6 months polishing features that may not have buyers.',
        },
      ],
      assumptions: [
        {
          assumption: 'GitHub stars and developer praise are a leading indicator of willingness to pay.',
          challenge: 'What evidence indicates individual developers have the budget or organizational mandate to buy security tooling?',
          counterpoint:
            'Developers star repositories for curiosity, reference, or free utility. Enterprise procurement is managed by security compliance leads with strict SOC2/ISO checklists.',
          evidenceNeeded:
            'Book 5 calls with security managers at mid-market firms to test if they would pay $500/mo for the hosted edition.',
        },
        {
          assumption: 'Sunsetting now means the last five months of engineering were wasted.',
          challenge: 'Are you falling into a classic sunk cost fallacy by conflating engineering sweat equity with future expected value?',
          counterpoint:
            'The core telemetry parsers and internal architecture can likely be repurposed into an enterprise compliance API within 3 weeks.',
          evidenceNeeded:
            'Audit the codebase to separate reusable domain logic from the open-source packaging wrapper.',
        },
        {
          assumption: 'A B2B pivot will immediately solve monetization velocity.',
          challenge: 'Do you currently possess the sales distribution and domain network required to close B2B contracts?',
          counterpoint:
            'B2B sales cycles typically take 90–120 days. Starting fresh with 7 months runway leaves very little margin for sales experimentation.',
          evidenceNeeded:
            'Pre-sell or secure 2 design partner commitments before rewriting the product line.',
        },
      ],
      risks: [
        'Depleting the remaining 7 months of runway while hoping for organic enterprise inbound.',
        'Pivoting too broadly into a generic enterprise space where incumbents dominate sales channels.',
        'Team burnout caused by shifting product direction without clear validation milestones.',
      ],
      unknowns: [
        'The true willingness of current open-source users to pay if features were gated behind a commercial license.',
        'Your competitive edge in outbound enterprise sales versus your technical product velocity.',
      ],
      options: [
        {
          name: 'The 30-Day Commercial Gate Experiment',
          upside: 'Directly tests monetization with zero architectural refactoring.',
          downside: 'Risk of mild community friction over licensing distinctions.',
          unknown: 'Whether existing power users value enterprise features enough to pay.',
        },
        {
          name: 'Aggressive B2B Pivot to Compliance Automation',
          upside: 'Higher contract values ($15k–$40k ACV) and clear buyer persona (CISOs).',
          downside: 'Long sales cycles that clash with the 7-month runway clock.',
          unknown: 'Your speed at navigating complex vendor procurement hurdles.',
        },
        {
          name: 'Open-Core Hybrid with Paid Support Contracts',
          upside: 'Generates immediate bridge cash flow without abandoning the OSS community.',
          downside: 'Exchanges high-margin SaaS multiples for time-intensive customer support.',
          unknown: 'How many engineering hours will be drained handling custom deployments.',
        },
      ],
      museTake: {
        summary:
          'Do not abandon your telemetry engine purely out of anxiety, but stop relying on passive developer stars for validation. You are facing a distribution bottleneck, not a technical one.',
        reasoning:
          'Pivoting products before diagnosing why the first failed usually recreates the same failure under a different title. A 3-week commercial gate test will provide more clarity than 3 months of speculative planning.',
        recommendedNextStep:
          'Send a direct, personal outreach to the top 20 most active repository contributors asking: "If we host and manage this with SOC2 audit logging, would your company expense $400/month?" Measure the conversion rate.',
      },
    },
    outcome: null,
    reflectionNotes:
      'Scheduled review meeting with co-founder for next Thursday. We agreed not to write new feature code until we complete 8 discovery interviews.',
  },
  {
    id: 'dec-nordic-media-2026',
    title: 'Accept the freelance retainer from Nordic Media',
    context:
      'Offered a $9,500/month guaranteed retainer for 25 hours/week of design systems engineering. It pays well, but I wanted this quarter to focus on launching my own indie products.',
    priorities: ['Money', 'Freedom', 'Learning'],
    concerns:
      'Scope creep draining creative energy; being too tired in the evenings to write code for personal software.',
    initialAssumptions:
      '25 hours per week will leave me with 15 productive hours every week for my own software projects.',
    status: 'decided',
    confidence: 78,
    createdAt: '2026-09-21T09:40:00.000Z',
    updatedAt: '2026-09-30T14:20:00.000Z',
    analysis: {
      confidenceEstimated: 78,
      coreBelief:
        'You believe intellectual energy is fungible like money, and that after 5 hours of complex client design work, you can effortlessly switch into building personal software.',
      optimizingFor: [
        {
          tag: 'Money',
          note: 'Guaranteed $9.5k/mo eliminates financial stress and boosts savings runway.',
        },
        {
          tag: 'Freedom',
          note: 'Desire to maintain autonomy over working hours and creative roadmap.',
        },
      ],
      assumptions: [
        {
          assumption: '25 client hours leaves 15 hours of prime creative focus for personal projects.',
          challenge: 'Does your peak creative cognitive stamina actually span 40 high-intensity hours per week?',
          counterpoint:
            'Most knowledge workers have 4–5 hours of high-depth creative bandwidth per day. Client meetings and Slack interruptions fragment cognitive continuity far beyond the logged hours.',
          evidenceNeeded:
            'Track your actual creative output during past freelance sprints: did side-project commits increase or drop to zero?',
        },
        {
          assumption: 'The client will respect the strict 25-hour boundary without constant asynchronous pings.',
          challenge: 'What operational guardrails have you written into the contract to prevent scope creep?',
          counterpoint:
            'Retainers naturally foster an expectation of always-on availability unless explicit response times (e.g. 24h turnarounds) are formalized.',
          evidenceNeeded:
            'Review the contract for explicit clauses stating asynchronous batch communication and no mandatory daily standups.',
        },
      ],
      risks: [
        'Postponing personal product launch by another 6 months while comfortably sustained by high retainer income.',
        'Context-switching fatigue leading to mediocre execution on both client deliverables and personal goals.',
      ],
      unknowns: [
        'The true meeting culture of Nordic Media’s internal engineering leads.',
        'Whether you have the emotional boundary strength to log off at exactly 25 hours when emergencies arise.',
      ],
      options: [
        {
          name: 'Accept retainer with strict 3-month contract cap and no daily standups',
          upside: 'Banks $28.5k in reserves while maintaining a firm exit horizon.',
          downside: 'Slightly reduced leverage if the client demands high ad-hoc flexibility.',
          unknown: 'Whether the client will agree to a 3-month term without a year-long renewal.',
        },
        {
          name: 'Counter with a fixed-scope deliverable sprint rather than hourly retainer',
          upside: 'Decouples income from hours worked; allows batching work into 10 days.',
          downside: 'Requires upfront project scoping and absorbs deadline risk.',
          unknown: 'Whether the client has clear enough requirements for fixed-scope.',
        },
        {
          name: 'Decline and protect full-time focus on personal product',
          upside: '100% cognitive allocation toward compounding equity and creative autonomy.',
          downside: 'Immediate burn of personal savings without revenue validation.',
          unknown: 'How long personal runway can sustain without anxiety corrupting decision quality.',
        },
      ],
      museTake: {
        summary:
          'Accepting the retainer makes strategic sense only if you treat it as a disciplined financial engine for your product, rather than letting it become your default career identity.',
        reasoning:
          'Financial panic kills good product design faster than a busy schedule. But cognitive exhaustion is real: do not pretend you will build software after 6 hours on client calls.',
        recommendedNextStep:
          'Accept for a 90-day trial only, negotiate meeting days to Tuesday/Thursday only, and dedicate Monday and Friday exclusively to your own software.',
      },
    },
    outcome: {
      actualOutcome:
        'Accepted the retainer with Tuesday/Thursday meeting consolidation. Completed the first month and billed $9,500. However, asynchronous Slack messages on off-days caused frequent attention leaks, and personal product progress fell ~35% behind schedule.',
      whatGotRight:
        'The financial relief was immediate and eliminated runway anxiety. Consolidating meetings into two days preserved my mornings on Mondays and Wednesdays.',
      whatGotWrong:
        'I vastly underestimated how much asynchronous Slack notifications disrupt creative focus even on days when I wasn’t billing hours.',
      reviewedAt: '2026-09-30T14:20:00.000Z',
      predictionCalibration: 'Overconfident',
      actualOutcomeAssessment: 'Mixed',
      whatYouPredictedWell:
        'You accurately anticipated that consolidating meetings into 2 days would safeguard deep work blocks, and the financial peace of mind was verified.',
      whatYouMissed:
        'You failed to anticipate that asynchronous Slack channels create a constant low-level cognitive tax that drains energy even outside scheduled hours.',
      newPattern:
        'You tend to underestimate emotional and attention switching costs in client communication, even when total logged hours remain within budget.',
      calibrationScore: 72,
    },
    reflectionNotes:
      'Implemented a new rule: Slack is deleted from my phone, and notifications are muted completely on Mondays, Wednesdays, and Fridays until 4:00 PM.',
  },
  {
    id: 'dec-deep-work-routine-2026',
    title: 'Change my deep-work routine from early mornings to late evenings',
    context:
      'I have always tried to wake up at 5:30 AM to write and think, but I constantly feel sluggish and force caffeine. In contrast, between 9 PM and 1 AM my mind feels quiet, expansive, and naturally alert.',
    priorities: ['Focus', 'Health', 'Learning'],
    concerns:
      'Disrupting social synchronization with my partner; potential negative drift in sleep quality and physical vitality.',
    initialAssumptions:
      'Society glorifies morning routines, but my chronotype is fundamentally a night owl, and fighting it is wasting my highest-order output.',
    status: 'decided',
    confidence: 54,
    createdAt: '2026-09-10T18:30:00.000Z',
    updatedAt: '2026-09-24T11:00:00.000Z',
    analysis: {
      confidenceEstimated: 54,
      coreBelief:
        'You believe that alignment with your natural subjective alertness will outweigh the systemic frictions of living on an inverted schedule.',
      optimizingFor: [
        {
          tag: 'Focus',
          note: 'Eliminating the daily battle against morning brain fog and artificial stimulant reliance.',
        },
        {
          tag: 'Health',
          note: 'Desire for unforced, restorative sleep that honors biological rhythms.',
        },
      ],
      assumptions: [
        {
          assumption: 'Late-night quiet is uniquely productive for high-order synthesis.',
          challenge: 'Is the late-night alertness genuine cognitive clarity or an illusion driven by circadian adrenaline and reduced task scrutiny?',
          counterpoint:
            'Many late-night workers produce high volume because self-critique drops at night, but daytime review frequently reveals errors in architecture.',
          evidenceNeeded:
            'Compare code commit quality and bug fix rates from past late-night sessions against morning sessions.',
        },
        {
          assumption: 'An evening shift will not degrade sleep architecture or relationship intimacy.',
          challenge: 'How will going to sleep at 2 AM affect shared meals, sunlight exposure, and household rhythm?',
          counterpoint:
            'Delayed sleep phase syndrome often causes unintentional social isolation and vitamin D/mood dips due to missed daylight hours.',
          evidenceNeeded:
            'Run a two-week controlled trial with agreed wake times and a wearable sleep tracker.',
        },
      ],
      risks: [
        'Creeping bedtime drift (2 AM becomes 3:30 AM, eroding morning sunlight).',
        'Friction with partner’s morning schedule creating chronic misaligned weekends.',
      ],
      unknowns: [
        'Whether your late-night flow state is sustainable across 30 consecutive days without mood swings.',
      ],
      options: [
        {
          name: 'Full 30-Day Night Owl Experiment (Sleep 2 AM, Wake 9:30 AM)',
          upside: 'Directly tests natural circadian preference without morning alarm distress.',
          downside: 'Total desynchronization from normal daylight social activities.',
          unknown: 'Long-term sleep depth and morning restorative REM metrics.',
        },
        {
          name: 'The Mid-Morning Compromise (Sleep 12:00 AM, Deep Work 9:00 AM–1:00 PM)',
          upside: 'Preserves shared breakfast and natural circadian sunlight while removing brutal 5:30 AM alarms.',
          downside: 'Still requires shielding daytime hours from notifications and interruptions.',
          unknown: 'Whether morning fog dissipates naturally by 9:00 AM without caffeine spikes.',
        },
        {
          name: 'Biphasic Split: Early evening rest followed by focused night block',
          upside: 'Capitalizes on nocturnal quiet without completely abandoning daytime alignment.',
          downside: 'High discipline required to manage two distinct sleep cycles.',
          unknown: 'Body’s tolerance for broken sleep architecture.',
        },
      ],
      museTake: {
        summary:
          'Dismantle the dogmatic moralization of 5:30 AM awakenings, but beware of romanticizing the nocturnal drift. Test the 9:00 AM mid-morning compromise before jumping to 2:00 AM shifts.',
        reasoning:
          'Morning productivity culture is largely cultural dogma, but the biological requirement for early daylight and social rhythm is empirical physiology. The sweet spot is almost always shifting from 5:30 AM to a humane 7:30 AM wake time rather than becoming entirely nocturnal.',
        recommendedNextStep:
          'Conduct a 14-day protocol waking at 7:30 AM with zero caffeine after 12:00 PM. Evaluate cognitive output at 10:00 AM vs 10:00 PM with objective written logs.',
      },
    },
    outcome: null,
    reflectionNotes:
      'Adopted the 7:30 AM middle ground. Sleep score jumped by 14 points on Oura, and morning grogginess vanished without moving bedtime past midnight.',
  },
];
