import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

//{className,...props} it means that i want all valid props that a regular <form> tag can take eg action,method etc.
export function ListingForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form
      className={cn(
        "flex flex-col gap-5 bg-[#FFF9D9] rounded-3xl p-6 border border-black  shadow-black shadow-2xl",
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
        <Input
          id="title"
          type="text"
          placeholder="Levi's Jeans"
          className="bg-[#dbc8b0] border border-black"
          required
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your item in detail..."
          required
          rows={4}
          className="bg-[#dbc8b0] border border-black"
        />
      </div>

      <div className="flex justify-start gap-8 md:gap-20">
        <div className="flex flex-col gap-3 flex-1">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            type="text"
            placeholder="Clothing"
            className="bg-[#dbc8b0] w-[180px] border border-black"
            required
          />
        </div>
        <div className="flex flex-col gap-3 flex-1">
          <Label htmlFor="type">Type</Label>
          <Input
            id="type"
            type="text"
            placeholder="Jeans"
            className="bg-[#dbc8b0] w-[180px] border border-black"
            required
          />
        </div>
      </div>

      <div className="flex justify-start gap-8 md:gap-20">
        <div className="flex flex-col gap-3 flex-1">
          <Label htmlFor="size">Size</Label>
          <Select>
            <SelectTrigger className="w-[180px] bg-[#dbc8b0] border border-black">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">S</SelectItem>
              <SelectItem value="medium">M</SelectItem>
              <SelectItem value="large">L</SelectItem>
              <SelectItem value="extra-large">XL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-3 flex-1">
          <Label htmlFor="tags">Tags</Label>
          <Select>
            <SelectTrigger className="w-[180px] bg-[#dbc8b0] border border-black">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-start gap-8 md:gap-20">
        <div className="flex flex-col gap-3 flex-1">
          <Label htmlFor="condition">Condition</Label>
          <Select>
            <SelectTrigger className="w-[180px] bg-[#dbc8b0] border border-black">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="like-new">Like-New</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-3 flex-1">
          <Label htmlFor="gender">Gender</Label>
          <Select>
            <SelectTrigger className="w-[180px] bg-[#dbc8b0] border border-black">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="unisex">Unisex</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          className="bg-[#dbc8b0] border border-black"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Create listing
      </Button>
    </form>
  );
}
