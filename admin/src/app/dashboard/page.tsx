 "use client"

import React from "react"
import Link from "next/link"
import { Plus, FileText, CalendarPlus, Boxes, Briefcase } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const sections = [
  {
    title: "Blogs",
    description: "Create and manage blog posts for your site.",
    icon: <FileText className="w-5 h-5 text-muted-foreground" />,
    addLink: "/dashboard/blogs/add-blog",
    viewLink: "/dashboard/blogs/all-blogs",
  },
  {
    title: "Events",
    description: "Add upcoming events or showcases.",
    icon: <CalendarPlus className="w-5 h-5 text-muted-foreground" />,
    addLink: "/dashboard/events/add-event",
    viewLink: "/dashboard/events/all-events",
  },
  {
    title: "Products",
    description: "Showcase products you've built or contributed to.",
    icon: <Boxes className="w-5 h-5 text-muted-foreground" />,
    addLink: "/dashboard/products/add-products",
    viewLink: "/dashboard/products/all-products",
  },
  {
    title: "Investor Hub",
    description: "Share updates or investor-facing posts.",
    icon: <Briefcase className="w-5 h-5 text-muted-foreground" />,
    addLink: "/dashboard/investor-hub/add-post",
    viewLink: "/dashboard/investor-hub/all-post",
  },
]

const page = () => {
  return (
    <div className="px-6 py-4 space-y-6">
      <div className="border-b pb-2">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Manage all your content from one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Card key={section.title} className="rounded-lg border bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                {section.icon}
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{section.description}</p>
              <div className="flex gap-2">
                <Button asChild size="sm">
                  <Link href={section.addLink}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={section.viewLink}>Manage</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default page
