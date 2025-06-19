import { NextRequest, NextResponse } from "next/server"

// Types
interface MenuItem {
  id: number
  name: string
  price: number
  description: string
  image: string
  ingredients: string[]
  allergens: string[]
}

interface Group {
  id: number
  name: string
  description: string
  slug: string
  isPublic: boolean
  menuItems: MenuItem[]
}

// Mock data - replace with database calls
const groups: Group[] = [
  {
    id: 1,
    name: "Momo Corner",
    description: "Authentic Nepalese dumplings and traditional dishes",
    slug: "momo-corner",
    isPublic: true,
    menuItems: [
      {
        id: 1,
        name: "Chicken Momo",
        price: 12.99,
        description: "Traditional steamed dumplings filled with seasoned chicken",
        image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400",
        ingredients: ["Chicken", "Flour", "Onion", "Garlic", "Ginger", "Spices"],
        allergens: ["Gluten", "May contain traces of soy"],
      },
      {
        id: 2,
        name: "Veg Momo",
        price: 10.99,
        description: "Steamed dumplings with mixed vegetables and herbs",
        image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400",
        ingredients: ["Cabbage", "Carrot", "Onion", "Flour", "Garlic", "Ginger"],
        allergens: ["Gluten"],
      },
      {
        id: 3,
        name: "Jhol Momo",
        price: 14.99,
        description: "Momo served in spicy sesame and tomato soup",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        ingredients: ["Chicken", "Flour", "Tomato", "Sesame", "Spices"],
        allergens: ["Gluten", "Sesame"],
      },
    ],
  },
  {
    id: 2,
    name: "Cafe Delight",
    description: "Premium coffee and pastries",
    slug: "cafe-delight",
    isPublic: true,
    menuItems: [
      {
        id: 4,
        name: "Espresso",
        price: 3.5,
        description: "Rich, full-bodied espresso shot",
        image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400",
        ingredients: ["Arabica Coffee Beans"],
        allergens: ["Caffeine"],
      },
      {
        id: 5,
        name: "Croissant",
        price: 4.25,
        description: "Buttery, flaky French pastry",
        image: "https://images.unsplash.com/photo-1555507036-ab794f665976?w=400",
        ingredients: ["Flour", "Butter", "Eggs", "Milk", "Sugar"],
        allergens: ["Gluten", "Dairy", "Eggs"],
      },
    ],
  },
]

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 })
    }

    // TODO: Replace with actual database query
    // Example with Prisma:
    // const group = await prisma.group.findFirst({
    //   where: {
    //     slug: slug,
    //     isPublic: true
    //   },
    //   include: {
    //     menuItems: true
    //   }
    // })

    const group = groups.find((g) => g.slug === slug && g.isPublic)

    if (!group) {
      return NextResponse.json({ error: "Menu not found or not public" }, { status: 404 })
    }

    // Return the group data
    return NextResponse.json({
      success: true,
      data: group,
    })
  } catch (error) {
    console.error("Error fetching menu:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Optional: Handle other HTTP methods
export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
