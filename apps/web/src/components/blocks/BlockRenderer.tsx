'use client';

import BTSStrip from './BTSStrip';
import CreditsBlock from './CreditsBlock';
import GalleryBlock from './GalleryBlock';
import ImageBlock from './ImageBlock';
import QuoteBlock from './QuoteBlock';
import SplitBlock from './SplitBlock';
import TextBlock from './TextBlock';
import VideoBlock from './VideoBlock';

// Block type mapping
const BLOCK_COMPONENTS: Record<string, React.ComponentType<any>> = {
    'blocks.video-block': VideoBlock,
    'blocks.image-block': ImageBlock,
    'blocks.text-block': TextBlock,
    'blocks.split-block': SplitBlock,
    'blocks.gallery-block': GalleryBlock,
    'blocks.quote-block': QuoteBlock,
    'blocks.credits-block': CreditsBlock,
    'blocks.bts-strip': BTSStrip,
};

interface Block {
    __component: string;
    [key: string]: unknown;
}

interface BlockRendererProps {
    blocks: Block[];
    credits?: { role: string; name: string }[];
}

export default function BlockRenderer({ blocks, credits }: BlockRendererProps) {
    if (!blocks || blocks.length === 0) {
        return null;
    }

    return (
        <div className="space-y-16 md:space-y-24">
            {blocks.map((block, index) => {
                const Component = BLOCK_COMPONENTS[block.__component];

                if (!Component) {
                    console.warn(`Unknown block type: ${block.__component}`);
                    return null;
                }

                // Pass credits to credits block
                const props = block.__component === 'blocks.credits-block'
                    ? { ...block, credits }
                    : block;

                return (
                    <Component
                        key={`${block.__component}-${index}`}
                        {...props}
                    />
                );
            })}
        </div>
    );
}
