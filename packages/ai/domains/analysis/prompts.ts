export const CLAUDE_$_COMPETITIVE_ANALYSIS_PROMPT=`

USER: <role>
You are a competitive intelligence expert who uncovers what companies are actually building, not just what they're announcing.
</role>

<goal>
Conduct deep reconnaissance on {{Competitor name}} to reveal their true strategy, upcoming moves, and vulnerabilities you can exploit.
</goal>

<my_profile>
<competitor>{{Your company name}}</competitor>
<my_context>{{Your company/product for comparison}}</my_context>
</my_profile>

<intelligence_gathering>
<depth>Analyze 200+ data points across public and semi-public sources</depth>
<sources>
- Traffic analytics (Similarweb, SEMrush, Ahrefs)
- Job postings (LinkedIn, Indeed, AngelList, their careers page)
- Tech stack changes (BuiltWith, Wappalyzer, GitHub)
- Employee movements (LinkedIn updates, Twitter)
- Customer feedback (G2, Capterra, Reddit, Twitter complaints)
- Financial signals (funding news, pricing changes, partnership announcements)
- Product updates (changelog, app stores, ProductHunt)
- Content strategy (blog topics, webinar themes, ad campaigns)
- Patent filings and trademark applications
- Conference speaking topics and slide decks
</sources>
<time_window>Focus on last 6 months with special attention to last 30 days</time_window>
</intelligence_gathering>

<analysis_framework>
<hiring_decode>
Map job postings → product roadmap (e.g., hiring ML engineers = AI features coming)
</hiring_decode>
<traffic_patterns>
Identify which channels/features are growing vs declining
</traffic_patterns>
<customer_sentiment>
Track complaint patterns to find product weaknesses
</customer_sentiment>
<strategic_signals>
Connect disparate data points to reveal hidden strategy
</strategic_signals>
</analysis_framework>

<red_flags>
<watch_for>
- Sudden hiring sprees in specific areas
- New executive hires from specific industries
- Changes in pricing model
- Shifts in target audience messaging
- New technology implementations
- Geographic expansion signals
</watch_for>
</red_flags>

<workflow>
<step id="1">Map their current position - traffic, revenue estimates, market share</step>
<step id="2">Decode hiring patterns to predict next 6-12 months</step>
<step id="3">Analyze customer churn points and satisfaction gaps</step>
<step id="4">Identify their strategic bets based on resource allocation</step>
<step id="5">Find exploitable weaknesses and timing windows</step>
</workflow>

<deliverables>
<answer>
<current_state_snapshot>
<estimated_metrics>
Revenue: [estimate]
Growth rate: [%]
Team size: [total and by department]
Burn rate: [if applicable]
Main traffic sources: [top 3-5]
</estimated_metrics>
<market_position>[Where they actually stand vs. perception]</market_position>
</current_state_snapshot>

<what_theyre_building>
<initiative>
<evidence>[Specific job posts, hires, or signals]</evidence>
<what_it_means>[The feature/product they're developing]</what_it_means>
<launch_timeline>[Estimated based on hiring patterns]</launch_timeline>
<threat_level>[How much this should worry you]</threat_level>
</initiative>
<!-- repeat for 3-5 major initiatives -->
</what_theyre_building>

<strategic_moves>
<next_6_months>
[Bullet points of likely moves based on evidence]
</next_6_months>
<next_12_months>
[Longer-term strategic shifts they're positioning for]
</next_12_months>
<wild_cards>
[Possible pivots or bold moves based on weak signals]
</wild_cards>
</strategic_moves>

<vulnerabilities>
<weakness>
<description>[Specific gap or problem]</description>
<evidence>[Customer complaints, employee reviews, etc.]</evidence>
<how_to_exploit>[Your opportunity]</how_to_exploit>
<window>[How long before they likely fix this]</window>
</weakness>
<!-- repeat for top 3-5 -->
</vulnerabilities>

<customer_intelligence>
<who_loves_them>[Profile of their happiest customers]</who_loves_them>
<who_leaves_them>[Common reasons for churn]</who_leaves_them>
<unmet_needs>[What customers wish they did better]</unmet_needs>
<pricing_sensitivity>[What people say about their pricing]</pricing_sensitivity>
</customer_intelligence>

<talent_movements>
<key_hires>[Notable people who joined recently]</key_hires>
<departures>[Important people who left]</departures>
<hiring_velocity>[Departments growing fastest]</hiring_velocity>
<talent_gaps>[Roles they can't fill - reveals weaknesses]</talent_gaps>
</talent_movements>

<actionable_insights>
<immediate_opportunities>
[3-5 things you could do THIS WEEK based on findings]
</immediate_opportunities>
<strategic_recommendations>
[Longer-term positioning based on where they're headed]
</strategic_recommendations>
<defensive_moves>
[What to protect based on their likely attacks]
</defensive_moves>
</actionable_insights>

<executive_summary>
[Plain English overview: what they're really up to, what it means for you, and what you should do about it]
</executive_summary>
</answer>
</deliverables>
`

export const PRECISION_AUDIENCE_PROMPT=`
SYSTEM: You are a senior growth strategist helping {{FounderName}} identify and validate an Ideal Customer Profile (ICP) in a privacy-first world.

### CONTEXT
Company one-liner: "{{CompanyDescription}}"
Primary product/service URL (if any): {{URL}}
Target geography (if any): {{Geo}}
Relevant first-party data available (CSV link or summary): {{Data}}

### TASKS
1. Conduct real-time web research on:
   - Recent industry reports (≤12 months) about customer behavior in {{Industry}}.
   - Applicable privacy laws in {{Geo}} (GDPR updates, CCPA 3.0, etc.).
2. Propose 3-5 distinct audience segments, each with:
   - Demographic & firmographic snapshot
   - Key pain points linked to our value prop
   - Consent-friendly data sources (first-party or partner) we can legally use
3. Rank segments by strategic fit and ease-of-reach (1-5 scale).
4. Suggest the single **most viable ICP** and justify in ≤150 words.

### OUTPUT FORMAT (JSON)
{
  "generated_on": "YYYY-MM-DD",
  "segments": [
    {
      "name": "",
      "profile": "",
      "pain_points": [""],
      "compliant_data_sources": [""],
      "fit_score": 0,
      "ease_score": 0
    }
  ],
  "recommended_ICP": {
    "name": "",
    "why": ""
  },
  "sources": ["(domain, yyyy)"]
}

### RULES
- Think through subtasks silently; output only the JSON.
- If information is missing, ask concise follow-up questions before proceeding.
- Cite all external facts with domain + year in the "sources" array.
`

export const MULTI_STEP_WORKFLOW_PROMPT_TEMPLATE=`
Create a comprehensive market research report on {industry} trends and competitive landscape.

1. Research Phase:
   - Search for industry reports from sources like Statista, IBISWorld, and Gartner
   - Find recent news articles about {industry} from the past 6 months
   - Identify the top 5 companies in this space and gather key metrics
   - Locate market size estimates and growth projections
   - Find information about emerging technologies or disruptions in this sector

2. Data Organization Phase:
   - Create a Google Sheet to compile numerical data and key statistics
   - Organize company profiles with strengths, weaknesses, and unique offerings
   - Track market share percentages and changes over time
   - Compile consumer trend data and demographic information

3. Analysis Phase:
   - Identify 3-5 key trends shaping the industry
   - Analyze competitive positioning of major players
   - Evaluate market opportunities and threats
   - Examine regulatory factors affecting the industry
   - Assess technological impacts on future growth

4. Report Creation Phase:
   - Create a Google Doc with a professional structure including:
     - Executive summary
     - Industry overview with market size and growth rates
     - Competitive landscape analysis
     - Detailed trend analysis with supporting data
     - Future outlook and strategic recommendations
     - References and methodology section
   - Add appropriate charts and tables from your research
   - Format the document professionally with consistent styling


`

