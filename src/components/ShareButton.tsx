import { Button } from "./ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  slug: string;
  className?: string;
}

export const ShareButton = ({ slug, className }: ShareButtonProps) => {
  const url = `${window.location.origin}/${slug}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Fantasy League", url });
        return;
      } catch {
        // User cancelled or share failed, fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!", { description: url });
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className={className}
      title="Share league link"
    >
      <Share2 className="w-4 h-4" />
      <span className="hidden sm:inline ml-1.5">Share</span>
    </Button>
  );
};
