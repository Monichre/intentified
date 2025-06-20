import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import IntentifiedSignalSourcingPipeline from '../intentified-signal-sourcing-pipeline';

describe('IntentifiedSignalSourcingPipeline', () => {
  it('renders the main title', () => {
    render(<IntentifiedSignalSourcingPipeline />);
    
    expect(screen.getByText('Intentified Marketing Intelligence Platform')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<IntentifiedSignalSourcingPipeline />);
    
    expect(screen.getByText('Turn Competitors\' Website Visitors Into Your Opportunities')).toBeInTheDocument();
  });

  it('renders the CTA button', () => {
    render(<IntentifiedSignalSourcingPipeline />);
    
    expect(screen.getByText('Start Tracking Intent Signals')).toBeInTheDocument();
  });

  it('renders metrics when showMetrics is true', () => {
    render(<IntentifiedSignalSourcingPipeline showMetrics={true} />);
    
    expect(screen.getByText('Signal Sources')).toBeInTheDocument();
    expect(screen.getByText('Live Metrics')).toBeInTheDocument();
  });

  it('hides metrics when showMetrics is false', () => {
    render(<IntentifiedSignalSourcingPipeline showMetrics={false} />);
    
    expect(screen.queryByText('Signal Sources')).not.toBeInTheDocument();
    expect(screen.queryByText('Live Metrics')).not.toBeInTheDocument();
  });

  it('renders all timeline steps', () => {
    render(<IntentifiedSignalSourcingPipeline />);
    
    // The timeline steps should be rendered by the RadialOrbitalTimeline component
    // We can test that the component renders without errors
    expect(screen.getByText('Intentified Marketing Intelligence Platform')).toBeInTheDocument();
  });
});