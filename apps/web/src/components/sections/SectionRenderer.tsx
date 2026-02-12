'use client';

import AwardsPress from './AwardsPress';
import Capabilities from './Capabilities';
import ClientsLogos from './ClientsLogos';
import CTAFooter from './CTAFooter';
import FeaturedWorks from './FeaturedWorks';
import HeroShowreel from './HeroShowreel';
import Manifesto from './Manifesto';
import Process from './Process';
import StudioTeam from './StudioTeam';

// Section type mapping
const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
    'sections.hero-showreel': HeroShowreel,
    'sections.featured-works': FeaturedWorks,
    'sections.capabilities': Capabilities,
    'sections.manifesto': Manifesto,
    'sections.clients-logos': ClientsLogos,
    'sections.awards-press': AwardsPress,
    'sections.process': Process,
    'sections.studio-team': StudioTeam,
    'sections.cta-footer': CTAFooter,
};

interface Section {
    __component: string;
    [key: string]: unknown;
}

interface SectionRendererProps {
    sections: Section[];
    locale?: string;
}

export function SectionRenderer({ sections, locale = 'tr' }: SectionRendererProps) {
    if (!sections || sections.length === 0) {
        return null;
    }

    return (
        <>
            {sections.map((section, index) => {
                const Component = SECTION_COMPONENTS[section.__component];

                if (!Component) {
                    console.warn(`Unknown section type: ${section.__component}`);
                    return null;
                }

                return (
                    <Component
                        key={`${section.__component}-${index}`}
                        {...section}
                        locale={locale}
                    />
                );
            })}
        </>
    );
}

export default SectionRenderer;

