import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function Featuredcard({ 
  title, 
  description, 
  imageUrl,
  badge = "Featured",
  buttonText = "View"
}: { 
  title: string; 
  description: string; 
  imageUrl: string;
  badge?: string;
  buttonText?: string;
}) {
  return (
    <Card className="relative w-full pt-0 bg-neutral-900/90 border border-neutral-700 rounded-xl shadow-lg overflow-hidden hover:border-neutral-500 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
      <div className="relative">
        <div className="absolute inset-0 z-10 bg-linear-to-t from-neutral-900 to-transparent" />
        <img
          src={imageUrl}
          alt={title}
          className="aspect-video w-full object-cover brightness-75"
        />
      </div>
      <CardHeader className="relative z-20 -mt-8">
        <CardAction>
          <Badge variant="secondary" className="bg-neutral-800 text-neutral-200 border-neutral-600">{badge}</Badge>
        </CardAction>
        <CardTitle className="text-white">{title}</CardTitle>
        <CardDescription className="text-neutral-400">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-0">
        <Button className="w-full bg-white text-black hover:bg-neutral-200 font-semibold">{buttonText}</Button>
      </CardFooter>
    </Card>
  )
}
