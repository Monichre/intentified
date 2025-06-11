import type { EmailTemplate, BrandAnalysis } from "./marketing-intelligence.service";
import { askAiStructuredResponse } from "../../agents/utilities/common";
import { MODEL_REGISTRY } from "../../core/models/model-registry";
import { z } from "zod";

export interface ReactEmailComponentData {
  componentName: string;
  componentCode: string;
  propsInterface: string;
  exampleProps: Record<string, any>;
  dependencies: string[];
  styling: {
    css: string;
    inlineStyles: Record<string, Record<string, string>>;
  };
  responsiveBreakpoints: Record<string, string>;
  emailClientCompatibility: string[];
}

export interface EmailDesignSystem {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string[];
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
  typography: {
    fontFamily: string;
    headingScale: Record<string, { fontSize: string; lineHeight: string; fontWeight: string }>;
    bodyText: Record<string, { fontSize: string; lineHeight: string }>;
  };
  spacing: {
    scale: string[];
    sections: Record<string, string>;
  };
  layout: {
    maxWidth: string;
    padding: Record<string, string>;
    borderRadius: Record<string, string>;
  };
  components: {
    button: Record<string, any>;
    card: Record<string, any>;
    header: Record<string, any>;
    footer: Record<string, any>;
  };
}

const ReactEmailComponentSchema = z.object({
  componentName: z.string(),
  componentCode: z.string(),
  propsInterface: z.string(),
  exampleProps: z.record(z.any()),
  dependencies: z.array(z.string()),
  styling: z.object({
    css: z.string(),
    inlineStyles: z.record(z.record(z.string()))
  }),
  responsiveBreakpoints: z.record(z.string()),
  emailClientCompatibility: z.array(z.string())
});

const EmailDesignSystemSchema = z.object({
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    neutral: z.array(z.string()),
    semantic: z.object({
      success: z.string(),
      warning: z.string(),
      error: z.string(),
      info: z.string()
    })
  }),
  typography: z.object({
    fontFamily: z.string(),
    headingScale: z.record(z.object({
      fontSize: z.string(),
      lineHeight: z.string(),
      fontWeight: z.string()
    })),
    bodyText: z.record(z.object({
      fontSize: z.string(),
      lineHeight: z.string()
    }))
  }),
  spacing: z.object({
    scale: z.array(z.string()),
    sections: z.record(z.string())
  }),
  layout: z.object({
    maxWidth: z.string(),
    padding: z.record(z.string()),
    borderRadius: z.record(z.string())
  }),
  components: z.object({
    button: z.record(z.any()),
    card: z.record(z.any()),
    header: z.record(z.any()),
    footer: z.record(z.any())
  })
});

export const makeReactEmailGeneratorService = () => {

  /**
   * Generate email design system from brand analysis
   */
  const generateDesignSystem = async (brandAnalysis: BrandAnalysis): Promise<EmailDesignSystem> => {
    const prompt = `
Create a comprehensive email design system based on this brand analysis:

**Brand Identity:**
- Values: ${brandAnalysis.brandIdentity.values.join(', ')}
- Personality: ${brandAnalysis.brandIdentity.personality.join(', ')}
- Positioning: ${brandAnalysis.brandIdentity.positioning}

**Communication Style:**
- Primary Tone: ${brandAnalysis.tone.primary}
- Communication Style: ${brandAnalysis.communicationStyle.style}

**Visual Preferences:**
- Color Scheme: ${brandAnalysis.visualPreferences.colorScheme}
- Design Style: ${brandAnalysis.visualPreferences.designStyle}

**Market Position:**
- Position: ${brandAnalysis.competitiveAnalysis.marketPosition}

Generate a complete email design system that includes:

1. **Color Palette**: Primary, secondary, accent, and neutral colors that match their brand
2. **Typography**: Font families, heading scales, and body text specifications
3. **Spacing System**: Consistent spacing scale and section layouts
4. **Layout Specifications**: Max widths, padding, and border radius values
5. **Component Styles**: Button, card, header, and footer styling specifications

The design system should be professional, email-client compatible, and true to their brand identity.
    `;

    const { object: designSystem } = await askAiStructuredResponse({
      prompt,
      schema: EmailDesignSystemSchema,
      model: MODEL_REGISTRY.anthropic.CLAUDE_35_SONNET_20241022.model,
      system: "You are an expert email designer and design systems architect. Create comprehensive, email-client-compatible design systems that perfectly capture brand identity and ensure consistent visual communication."
    });

    return designSystem;
  };

  /**
   * Generate React Email component from template
   */
  const generateReactEmailComponent = async (
    template: EmailTemplate,
    brandAnalysis: BrandAnalysis,
    designSystem: EmailDesignSystem
  ): Promise<ReactEmailComponentData> => {
    const prompt = `
Generate a production-ready React Email component for this email template:

**Template Information:**
- Name: ${template.name}
- Purpose: ${template.purpose}
- Theme: ${template.designVariant.theme}
- Layout: ${template.designVariant.layout}
- Subject: ${template.subject}
- Preview Text: ${template.previewText}

**Content Structure:**
${template.content.html}

**Design System:**
${JSON.stringify(designSystem, null, 2)}

**Brand Guidelines:**
- Tone: ${brandAnalysis.tone.primary}
- Communication Style: ${brandAnalysis.communicationStyle.style}
- Design Style: ${brandAnalysis.visualPreferences.designStyle}

**Personalization Variables:**
${template.personalization.variables.join(', ')}

Create a React Email component that:

1. **Uses @react-email/components** - Import and use appropriate components
2. **Implements the design system** - Use colors, typography, and spacing from the design system
3. **Matches the layout** - Implement the specified layout pattern (${template.designVariant.layout})
4. **Supports personalization** - Include all personalization variables as props
5. **Is mobile-responsive** - Works perfectly on all devices and email clients
6. **Follows email best practices** - Inline styles, table-based layouts where needed
7. **Includes conditional sections** - Support for dynamic content based on conditions

**Required Output:**
- Complete React component code with TypeScript
- Props interface definition
- Example props object
- CSS/styling specifications
- Email client compatibility notes
- Dependencies list

The component should be production-ready and render perfectly across all major email clients.
    `;

    const { object: componentData } = await askAiStructuredResponse({
      prompt,
      schema: ReactEmailComponentSchema,
      model: MODEL_REGISTRY.anthropic.CLAUDE_4_SONNET_20240229.model,
      system: `You are an expert React Email developer specializing in cross-client email compatibility. Create production-ready email components that render perfectly in Gmail, Outlook, Apple Mail, and all major email clients. Focus on table-based layouts, inline styles, and email-specific best practices.`
    });

    return componentData;
  };

  /**
   * Generate multiple email template variations
   */
  const generateTemplateVariations = async (
    baseTemplate: EmailTemplate,
    brandAnalysis: BrandAnalysis,
    variationCount: number = 3
  ): Promise<EmailTemplate[]> => {
    const variations: EmailTemplate[] = [];

    const designThemes: EmailTemplate['designVariant']['theme'][] = [
      'minimal', 'corporate', 'modern', 'creative', 'dark', 'colorful'
    ];

    const layouts: EmailTemplate['designVariant']['layout'][] = [
      'single_column', 'two_column', 'hero_banner', 'card_layout'
    ];

    for (let i = 0; i < variationCount; i++) {
      const theme = designThemes[i % designThemes.length];
      const layout = layouts[i % layouts.length];

      const prompt = `
Create a variation of this email template with different visual design:

**Original Template:**
- Name: ${baseTemplate.name}
- Purpose: ${baseTemplate.purpose}
- Content: ${baseTemplate.content.html}

**New Design Specifications:**
- Theme: ${theme}
- Layout: ${layout}
- Variation Number: ${i + 1}

**Brand Analysis:**
- Tone: ${brandAnalysis.tone.primary}
- Communication Style: ${brandAnalysis.communicationStyle.style}
- Visual Style: ${brandAnalysis.visualPreferences.designStyle}

Create a distinctly different visual variation while maintaining:
1. The same core message and content structure
2. Brand consistency and tone
3. The same personalization variables
4. High conversion potential

Make this variation visually distinct from the original while staying true to the brand.
      `;

      const EmailTemplateVariationSchema = z.object({
        name: z.string(),
        description: z.string(),
        subject: z.string(),
        previewText: z.string(),
        content: z.object({
          html: z.string(),
          text: z.string()
        }),
        designVariant: z.object({
          name: z.string(),
          theme: z.enum(['minimal', 'corporate', 'modern', 'creative', 'dark', 'colorful', 'newsletter', 'product', 'event', 'personal']),
          primaryColor: z.string(),
          secondaryColor: z.string(),
          layout: z.enum(['single_column', 'two_column', 'hero_banner', 'card_layout', 'timeline', 'grid'])
        }),
        performance: z.object({
          estimatedOpenRate: z.number().min(0).max(1),
          estimatedClickRate: z.number().min(0).max(1),
          difficulty: z.enum(['easy', 'medium', 'hard']),
          bestTimeToSend: z.string()
        })
      });

      const { object: variation } = await askAiStructuredResponse({
        prompt,
        schema: EmailTemplateVariationSchema,
        model: MODEL_REGISTRY.anthropic.CLAUDE_35_SONNET_20241022.model,
        system: "You are an expert email designer creating high-converting template variations. Focus on visual diversity while maintaining brand consistency and conversion optimization."
      });

      variations.push({
        id: `${baseTemplate.id}-var-${i + 1}`,
        ...variation,
        purpose: baseTemplate.purpose,
        personalization: baseTemplate.personalization,
        content: {
          ...variation.content,
          reactEmailComponent: '' // Will be generated separately
        },
        createdAt: new Date().toISOString()
      });
    }

    return variations;
  };

  /**
   * Generate complete email component package
   */
  const generateEmailComponentPackage = async (
    template: EmailTemplate,
    brandAnalysis: BrandAnalysis
  ): Promise<{
    designSystem: EmailDesignSystem;
    component: ReactEmailComponentData;
    variations: EmailTemplate[];
    componentVariations: ReactEmailComponentData[];
  }> => {
    // Step 1: Generate design system
    const designSystem = await generateDesignSystem(brandAnalysis);

    // Step 2: Generate main component
    const component = await generateReactEmailComponent(template, brandAnalysis, designSystem);

    // Step 3: Generate template variations
    const variations = await generateTemplateVariations(template, brandAnalysis, 3);

    // Step 4: Generate React components for variations
    const componentVariations: ReactEmailComponentData[] = [];
    
    for (const variation of variations) {
      const varComponent = await generateReactEmailComponent(variation, brandAnalysis, designSystem);
      componentVariations.push(varComponent);
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return {
      designSystem,
      component,
      variations,
      componentVariations
    };
  };

  /**
   * Generate Resend-ready email template
   */
  const generateResendTemplate = async (
    template: EmailTemplate,
    componentData: ReactEmailComponentData
  ): Promise<{
    templateCode: string;
    sendFunction: string;
    exampleUsage: string;
  }> => {
    const prompt = `
Generate Resend email integration code for this React Email template:

**Template:** ${template.name}
**Purpose:** ${template.purpose}
**Component Name:** ${componentData.componentName}

**Personalization Variables:** ${template.personalization.variables.join(', ')}

Create:
1. **Template Registration Code** - How to register this template with Resend
2. **Send Function** - TypeScript function to send this email template
3. **Example Usage** - Complete example showing how to use the template

Include proper error handling, TypeScript types, and Resend best practices.
    `;

    const { object: resendCode } = await askAiStructuredResponse({
      prompt,
      schema: z.object({
        templateCode: z.string(),
        sendFunction: z.string(),
        exampleUsage: z.string()
      }),
      model: MODEL_REGISTRY.anthropic.CLAUDE_35_SONNET_20241022.model,
      system: "You are an expert in Resend email service integration. Create production-ready code with proper error handling, TypeScript types, and email delivery best practices."
    });

    return resendCode;
  };

  return {
    generateDesignSystem,
    generateReactEmailComponent,
    generateTemplateVariations,
    generateEmailComponentPackage,
    generateResendTemplate
  };
};

export type ReactEmailGeneratorService = ReturnType<typeof makeReactEmailGeneratorService>;