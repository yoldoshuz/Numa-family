import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";
import { pickLang } from "@/lib/utils/format";
import type { BlogPost } from "@/lib/api/types";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  post: BlogPost;
  locale: Locale;
  readMore: string;
  /** "wide" is the two-up layout used for the popular articles on /blog. */
  size?: "default" | "wide";
  className?: string;
}

export function ArticleCard({ post, locale, readMore, size = "default", className }: Props) {
  const title = pickLang(post.title, locale);
  const excerpt = pickLang(post.excerpt, locale);
  const tag = post.tags?.[0];

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-card-lg border border-hairline bg-white lift",
        className
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-mist",
          size === "wide" ? "aspect-[16/9]" : "aspect-[4/3]"
        )}
      >
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={title}
            fill
            sizes={size === "wide" ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            quality={90}
            // Covers are usually people; a centred crop in a wide box takes the
            // top of the head off, so the crop is anchored high instead.
            className="object-cover object-[center_25%] transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-mist to-white" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {tag && (
          <span className="mb-3.5 self-start rounded-full bg-brand-badge px-3.5 py-1.5 text-[0.68rem] font-semibold tracking-wide text-white uppercase">
            {tag}
          </span>
        )}

        <h3
          className={cn(
            "leading-snug font-extrabold text-ink transition-colors group-hover:text-brand",
            size === "wide" ? "text-lg sm:text-xl" : "text-base sm:text-[1.05rem]"
          )}
        >
          {title}
        </h3>

        {excerpt && (
          <p className="mt-3 line-clamp-4 text-[0.78rem] leading-[1.7] text-body">{excerpt}</p>
        )}

        <span className="mt-auto flex items-center gap-2 pt-5 text-[0.82rem] font-semibold text-brand">
          {readMore}
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
