
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import AnimatedHeroText from "@/components/home/AnimatedHeroText";
import FeaturedVideosSection from "@/components/home/FeaturedVideosSection";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SERVICES_DATA, TECH_STACK_DATA } from "@/lib/constants";
import {
  ArrowRight,
  Bot,
  Users,
  Zap,
  FileText,
  Brain,
  Star,
  Quote,
  Globe,
} from "lucide-react";
import Image from "next/image";
import BlogPostCard from "@/components/blog/BlogPostCard";
import QuoteFormSheet from "@/components/pricing/QuoteFormSheet";
import { categories, BlogPost, Product } from "@/types";
import { apiClient } from "@/lib/api";
import * as LucideIcons from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type ClientReview = {
  id: number;
  client_name: string;
  review_text: string;
  rating: number;
  avatar_url: string;
  created_at: string;
  published: number;
};

const ProductSkeleton = () => (
    <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-background/80 backdrop-blur-sm rounded-lg border border-border/10">
      <Skeleton className="w-full h-[100px] md:w-[150px] md:h-[100px] rounded-md bg-muted" />
      <div className="flex-1 w-full space-y-3">
        <Skeleton className="h-6 w-3/4 bg-muted" />
        <Skeleton className="h-4 w-full bg-muted" />
        <Skeleton className="h-4 w-5/6 bg-muted" />
        <Skeleton className="h-9 w-28 bg-muted" />
      </div>
    </div>
  );

export default function HomePage() {
  const [isQuoteSheetOpen, setIsQuoteSheetOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]); // For blogs
  const [postsLoading, setPostsLoading] = useState(true);
  const [clientReviews, setClientReviews] = useState<ClientReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/categories")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        // Set empty array on timeout/network errors to prevent UI breakage
        if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
          setCategories([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Fetch blogs directly from backend on port 9002
  useEffect(() => {
    const fetchBlogs = async () => {
      setPostsLoading(true);
      try {
        const res = await apiClient.get("/blogs");
        const data = res.data;
        const mapped = data.map((blog: any) => ({
          ...blog,
          imageUrl: blog.coverImage || blog.thumbnail, // Fallback to thumbnail
          date: blog.createdAt,
          excerpt: blog.summary,
        }));
        setBlogPosts(mapped.slice(0, 3));
      } catch (err: any) {
        console.error("Error fetching blogs for homepage:", err);
        // Set empty array on timeout/network errors
        if (err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK') {
          setBlogPosts([]);
        }
      } finally {
        setPostsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Fetch featured products directly from backend on port 9002
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setProductsLoading(true);
      try {
        const res = await apiClient.get("/products");
        const data = res.data;
        // Filter featured products and take first 2
        const featured = data
          .filter((product: Product) => product.is_featured === 1)
          .slice(0, 2);
        setFeaturedProducts(featured);
      } catch (error: any) {
        console.error("Error fetching featured products:", error);
        // Set empty array on timeout/network errors
        if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
          setFeaturedProducts([]);
        }
      } finally {
        setProductsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    setReviewsLoading(true);
    apiClient
      .get("/client-reviews")
      .then((res) => {
        // Filter only published reviews if needed
        setClientReviews(res.data.filter((r: any) => r.published));
      })
      .catch((error) => {
        console.error("Error fetching client reviews:", error);
        // Set empty array on timeout/network errors
        if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
          setClientReviews([]);
        }
      })
      .finally(() => {
        setReviewsLoading(false);
      });
  }, []);

  const heroTexts = [
    "Brewed Software with AI Precision",
    "Innovative Solutions for a Digital World",
    "Your Partner in Tech Excellence",
  ];

  const featuredServices = SERVICES_DATA.slice(0, 5);

  const techStackRow1Count = 13;
  const techStackRow2Count = 12;
  const techStackRow3Count = 10;

  const getSafeImageUrl = (imageUrl: string | undefined | null) => {
    if (
      !imageUrl ||
      imageUrl.trim() === "" ||
      imageUrl.includes("example.com")
    ) {
      return "/fallback.png";
    }
    return imageUrl;
  };

  const clientLogos = [
    { src: "/clients/client1.jpeg", name: "Acme Corp", country: "USA" },
    {
      src: "/clients/client2.jpeg",
      name: "Tech Solutions",
      country: "Germany",
    },
    { src: "/clients/client3.jpeg", name: "Innovate UK", country: "UK" },
    {
      src: "/clients/client4.jpeg",
      name: "Asia Holdings",
      country: "Singapore",
    },
    { src: "/clients/client1.jpeg", name: "Oz Ventures", country: "Australia" },
  ];

  return (
    <>
      <div className="space-y-16 md:space-y-24">
        {/* Hero Section */}
        <section className="relative text-center py-16 md:py-24 rounded-xl overflow-hidden shadow-lg">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            src="/codecafelab_herobgvideo.mp4"
          >
            Your browser does not support the video tag.
          </video>
          <div className="relative z-10 container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <AnimatedHeroText texts={heroTexts} />
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              CodeCafe Lab blends innovation, AI, and creativity to deliver
              cutting-edge software solutions tailored for your success.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => setIsQuoteSheetOpen(true)}
              >
                Get a Quote <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">
                  Talk to Us 24*7 <Bot className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Videos Section */}
        <FeaturedVideosSection />

        {/* Services Overview */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Expertise</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              We offer a comprehensive suite of services to transform your ideas
              into reality, leveraging the latest technologies and agile
              methodologies for exceptional results.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => {
              const MaybeIcon =
                LucideIcons[service.icon as keyof typeof LucideIcons];
              const Icon =
                typeof MaybeIcon === "function" ||
                (typeof MaybeIcon === "object" &&
                  MaybeIcon !== null &&
                  "$$typeof" in MaybeIcon)
                  ? (MaybeIcon as React.ElementType)
                  : LucideIcons["Globe"];
              return (
                <Card
                  key={service.slug}
                  className="hover:shadow-xl transition-shadow duration-300 flex flex-col"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {Icon && <Icon className="h-10 w-10 text-primary" />}
                      <CardTitle className="text-2xl">
                        {service.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription>
                      {service.description || "Explore our expert services."}
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="link"
                      asChild
                      className="mt-4 px-0 text-primary"
                    >
                      <Link href={`/services/${service.id}`}>
                        Learn More <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
            {/* See All Services Card */}
            <Card
              key="see-all-services"
              className="flex flex-col items-center justify-between p-6 text-center bg-card hover:shadow-xl transition-shadow duration-300 h-full border-2 border-primary/30"
            >
              <CardHeader className="p-2">
                <CardTitle className="text-2xl text-primary">
                  Explore All Services
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col items-center justify-center p-2">
                <p className="text-muted-foreground mb-4">
                  Dive deeper into our comprehensive range of solutions.
                </p>
              </CardContent>
              <CardFooter className="p-2 w-full">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
                >
                  <Link href="/services">
                    See All <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Featured AI Innovations */}
        <section className="relative overflow-hidden p-8 md:p-12 rounded-xl shadow-lg">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            src="/Featured AI Innovations.mp4"
          >
            Your browser does not support the video tag.
          </video>
          <div className="relative z-10">
            <div className="text-center mb-12">
              <Zap className="h-12 w-12 text-accent mx-auto mb-4" />
              <h2 className="text-3xl font-bold">Featured AI Innovations</h2>
              <p className="text-muted-foreground mt-2">
                Explore our cutting-edge AI-powered products.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {productsLoading ? (
                <>
                  <ProductSkeleton />
                  <ProductSkeleton />
                </>
              ) : featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="flex flex-col md:flex-row items-center gap-6 p-6 hover:shadow-xl transition-shadow duration-300 bg-background/80 backdrop-blur-sm"
                  >
                    <Image
                      src={getSafeImageUrl(product.image_url)}
                      alt={product.name}
                      width={150}
                      height={100}
                      className="rounded-md object-cover w-full md:w-[150px] h-auto md:h-[100px]"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://placehold.co/600x400/6366f1/ffffff?text=Project+Image";
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {product.is_featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                        <h3 className="text-xl font-semibold text-primary">
                          {product.name}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        {product.short_description || product.description}
                      </p>
                      <Button variant="outline" asChild size="sm">
                        <Link href={`/projects/${product.id}`}>
                          Discover <Bot className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 col-span-full">
                  <p className="text-muted-foreground">
                    No featured projects available at the moment.
                  </p>
                </div>
              )}
            </div>
            <div className="text-center mt-12">
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="text-accent hover:text-accent/90 hover:bg-accent/10"
              >
                <Link href="/projects">
                  Explore All Projects <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CodeCafe Lab Tech Stack Section */}
        <section className="ai-glow-bg pt-8 pb-16 md:pt-12 md:pb-24 rounded-xl">
          <div className="relative z-10 container mx-auto">
            <div className="text-center mb-12">
              <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold">CodeCafe Lab Tech Stack</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                We leverage a modern and versatile technology stack to build
                robust, scalable, and innovative solutions.
              </p>
            </div>
            <div className="space-y-6">
              {/* Row 1 */}
              <div className="flex flex-wrap justify-center items-center gap-4">
                {TECH_STACK_DATA.slice(0, techStackRow1Count).map(
                  (tech, itemIndex) => (
                    <div
                      key={tech.name}
                      className="w-28 h-28 flex flex-col items-center justify-center p-3 bg-card rounded-lg shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105"
                    >
                      <tech.icon
                        className={`h-8 w-8 mb-2 ${
                          itemIndex % 2 === 0 ? "text-primary" : "text-accent"
                        }`}
                      />
                      <p className="text-xs font-medium text-center text-muted-foreground">
                        {tech.name}
                      </p>
                    </div>
                  )
                )}
              </div>
              {/* Row 2 */}
              <div className="flex flex-wrap justify-center items-center gap-4">
                {TECH_STACK_DATA.slice(
                  techStackRow1Count,
                  techStackRow1Count + techStackRow2Count
                ).map((tech, itemIndex) => (
                  <div
                    key={tech.name}
                    className="w-28 h-28 flex flex-col items-center justify-center p-3 bg-card rounded-lg shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105"
                  >
                    <tech.icon
                      className={`h-8 w-8 mb-2 ${
                        itemIndex % 2 === 0 ? "text-primary" : "text-accent"
                      }`}
                    />
                    <p className="text-xs font-medium text-center text-muted-foreground">
                      {tech.name}
                    </p>
                  </div>
                ))}
              </div>
              {/* Row 3 */}
              <div className="flex flex-wrap justify-center items-center gap-4">
                {TECH_STACK_DATA.slice(
                  techStackRow1Count + techStackRow2Count,
                  techStackRow1Count + techStackRow2Count + techStackRow3Count
                ).map((tech, itemIndex) => (
                  <div
                    key={tech.name}
                    className="w-28 h-28 flex flex-col items-center justify-center p-3 bg-card rounded-lg shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105"
                  >
                    <tech.icon
                      className={`h-8 w-8 mb-2 ${
                        itemIndex % 2 === 0 ? "text-primary" : "text-accent"
                      }`}
                    />
                    <p className="text-xs font-medium text-center text-muted-foreground">
                      {tech.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="mt-8 md:mt-12">
          <h2 className="text-3xl p-10 text-center mb-12 font-brittany text-royal-shine">
            Trusted By
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {clientLogos.map((client, i) => (
              <Image
                key={client.name}
                src={client.src}
                alt={`${client.name} Logo`}
                width={120}
                height={60}
                title={`${client.name} (${client.country})`}
                className="opacity-70 hover:opacity-100 transition-opacity duration-300"
                data-ai-hint="tech client logo"
              />
            ))}
          </div>
        </section>

        {/* What Our Clients Say Section */}
        <section className="mt-8 md:mt-12">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Clients Say
          </h2>
          {reviewsLoading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : clientReviews.length > 0 ? (
            <div className="relative w-full overflow-hidden group">
              <div
                className="flex animate-marquee group-hover:pause whitespace-nowrap"
                style={{ willChange: "transform" }}
              >
                {[...clientReviews, ...clientReviews].map((review, index) => (
                  <div
                    key={`${review.id}-${index}`}
                    className="flex-shrink-0 w-80 mx-4"
                  >
                    <div className="relative bg-card rounded-2xl shadow-lg border border-border/20 p-6 flex flex-col h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                      <Quote className="absolute top-4 right-6 h-12 w-12 text-primary/10" />
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center mb-4">
                          <Image
                            src={getSafeImageUrl(review.avatar_url)}
                            alt={review.client_name}
                            width={50}
                            height={50}
                            className="rounded-full aspect-square border-2 border-primary/30 shadow-sm"
                            data-ai-hint="client avatar"
                          />
                          <div className="ml-4">
                            <h4 className="font-semibold text-lg text-primary">
                              {review.client_name}
                            </h4>
                          </div>
                        </div>
                        <p className="text-base text-muted-foreground italic flex-grow mb-4 line-clamp-4">
                          "{review.review_text}"
                        </p>
                        <div className="flex mt-auto">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={`star-${review.id}-${index}-${i}`}
                              className={`h-5 w-5 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No client reviews available yet.
            </p>
          )}
        </section>

        {/* Latest Blogs Section */}
        <section>
          <div className="text-center mb-12">
            <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold">Latest From Our Blog</h2>
            <p className="text-muted-foreground mt-2">
              Stay updated with our newest articles and insights.
            </p>
          </div>
          {postsLoading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : blogPosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No blog posts available yet.
            </p>
          )}
          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-primary border-primary hover:bg-primary/10 hover:text-primary"
            >
              <Link href="/blog">
                See All Articles <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Call to Action section */}
        <section className="relative overflow-hidden text-center py-16 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-xl">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            src="/coffee_with_codecafelab.mp4"
          >
            Your browser does not support the video tag.
          </video>
          <div className="relative z-10">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to Brew Your Next Big Idea?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Let&apos;s collaborate to build innovative solutions that drive
              your business forward.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setIsQuoteSheetOpen(true)}
            >
              Start a Project <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>
      <QuoteFormSheet
        isOpen={isQuoteSheetOpen}
        onOpenChange={setIsQuoteSheetOpen}
      />
    </>
  );
}
