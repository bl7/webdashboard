"use client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
  NavLink,
} from "@/components/ui"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

const footerItems = [
  { path: "#", name: "Blog", internal: true, new: false },
  { path: "/privacy-policy", name: "Privacy Policy", internal: true, new: false },
  { path: "/terms", name: "Terms and Conditions", internal: true, new: false },
  { path: "/cookie-policy", name: "Cookies Policy", internal: true, new: false },
  //   { path: "/support", name: "Help Center", internal: true, new: false },
  { path: "/faqs", name: "FAQs", internal: true, new: false },
]

export function SupportLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const breadcrumbitem = footerItems.find((item) => item.path === pathname)
  return (
    <div className="container relative flex w-full pb-14">
      <div className="sticky top-16 hidden h-fit w-60 p-5 md:block">
        <ul className="flex flex-col items-start gap-4">
          {footerItems.map((item, index) => {
            return (
              <li key={`${index}`}>
                <NavLink href={item.path} exact className="font-medium transition duration-300">
                  {item.name}
                  {item.new ? (
                    <span className="text-new ml-2 rounded-full px-2 py-0.5 text-xs font-medium leading-5">
                      New
                    </span>
                  ) : null}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="w-full md:w-[calc(100%-15rem)]">
        <div className="sticky top-16 flex w-full gap-4 bg-background py-5">
          <Drawer>
            <DrawerTrigger className="md:hidden">
              <Menu className="h-5 w-5" />
            </DrawerTrigger>
            <DrawerContent>
              <div className="px-8 py-20">
                <ul className="flex flex-col items-start gap-4">
                  {footerItems.map((item, index) => {
                    return (
                      <li key={`${index}`}>
                        <DrawerClose asChild>
                          <NavLink
                            href={item.path}
                            exact
                            className="font-medium transition duration-300"
                          >
                            {item.name}
                            {item.new ? (
                              <span className="text-new ml-2 rounded-full px-2 py-0.5 text-xs font-medium leading-5">
                                New
                              </span>
                            ) : null}
                          </NavLink>
                        </DrawerClose>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </DrawerContent>
          </Drawer>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="font-semibold">{breadcrumbitem?.name}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {children}
      </div>
    </div>
  )
}
