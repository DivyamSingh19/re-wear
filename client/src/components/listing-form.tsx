import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

//{className,...props} it means that i want all valid props that a regular <form> tag can take eg action,method etc.
export function ListingForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form
      className={cn(
        "flex flex-col gap-5 bg-[#FFF9D9] rounded-3xl p-6",
        className
      )}
      {...props}
    >
      <div className="flex flex-col justify-center">
        <h1 className="text-2xl font-bold">Create a new listing</h1>
        <p className="text-muted-foreground text-sm">
          Fill the form to list your item
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="title">Title</Label>
        <Input id="title" type="text" placeholder="Levi's Jeans" required />
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your item in detail..."
          required
          rows={4}
        />
      </div>

      <div className="flex justify-start gap-4 md:gap-20">
        <div className="flex flex-col gap-3 flex-1">
          <Label htmlFor="category">Category</Label>
          <Input id="category" type="text" placeholder="Clothing" required />
        </div>
        <div className="flex flex-col gap-3 flex-1">
          <Label htmlFor="type">Type</Label>
          <Input id="type" type="text" placeholder="Jeans" required />
        </div>
      </div>

      <div className="flex justify-start gap-4 md:gap-20">
        <div className="flex flex-col gap-3 flex-1">
          <Label htmlFor="size">Size</Label>
          <Input id="size" type="text" placeholder="M" required />
        </div>
        <div className="flex flex-col gap-3 flex-1">
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" type="text" placeholder="vintage, casual" required />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="condition">Condition</Label>
        <Input
          id="condition"
          type="text"
          placeholder="New, Like New, Good, Fair"
          required
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="image">Image</Label>
        <Input id="image" type="file" accept="image/*" required/>
      </div>

      <Button type="submit" className="w-full">
        Create listing
      </Button>
    </form>
  );
}
