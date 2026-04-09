---
name: shadcn-ui-development
description: "Invoke when building or modifying UI components with shadcn/ui. Triggers for: installing shadcn/ui components (Button, Dialog, Card, Table, Form, Input, Select, etc.), composing layouts with shadcn primitives, using Radix UI under the hood, customizing component variants with cva/class-variance-authority, theming with CSS variables, and integrating shadcn/ui with React or Inertia.js. Also triggers for: cn() utility usage, component composition patterns, accessible form controls with react-hook-form + zod, and data tables with TanStack Table. Skip for: plain Tailwind CSS without shadcn components, backend PHP logic, database queries, and API routes."
license: MIT
metadata:
  author: shadcn
---

# shadcn/ui Development

## Overview

shadcn/ui is a collection of re-usable components built using Radix UI primitives and Tailwind CSS. Components are **copied into your project** (not installed as a dependency), giving full ownership and customization.

## Installation

```bash
# Initialize shadcn/ui in your project
npx shadcn@latest init

# Add a component
npx shadcn@latest add button
npx shadcn@latest add dialog card table form input select
```

Components are added to `components/ui/` by default.

## Core Conventions

### cn() Utility
Always use `cn()` for merging class names — it combines `clsx` and `tailwind-merge`:

```tsx
import { cn } from "@/lib/utils"

<div className={cn("base-classes", condition && "conditional-class", className)} />
```

### Component Variants with cva
Use `class-variance-authority` for component variants:

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

## Theming

shadcn/ui uses CSS variables for theming defined in `globals.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode tokens */
  }
}
```

- Use `bg-background`, `text-foreground`, `border-border`, etc. — never raw hex values.
- Override tokens in `globals.css` to retheme globally. Never patch individual component files for theming.

## Component Patterns

### Form with react-hook-form + zod

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export function LoginForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### Data Table with TanStack Table

```tsx
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Define columns with columnHelper or ColumnDef[]
// Pass data + columns to useReactTable
// Render with shadcn Table primitives
```

### Dialog / Modal

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* content */}
  </DialogContent>
</Dialog>
```

### Select

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Select onValueChange={setValue} defaultValue={value}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="a">Option A</SelectItem>
    <SelectItem value="b">Option B</SelectItem>
  </SelectContent>
</Select>
```

## Component Composition Rules

- Use `asChild` prop to delegate rendering to a child element (avoids DOM nesting issues):
  ```tsx
  <Button asChild><a href="/dashboard">Go to Dashboard</a></Button>
  ```
- Compose components from primitives rather than overriding internal styles directly.
- Accept and forward `className` in custom wrappers using `cn()`.
- Keep component files in `components/ui/` unchanged when possible — extend via wrapper components.

## Accessibility

- All shadcn/ui components are built on Radix UI, which provides WAI-ARIA compliance by default.
- Always provide meaningful labels: use `<FormLabel>` for inputs, `aria-label` for icon-only buttons.
- Ensure `DialogTitle` is present in every `Dialog` (required for screen readers).
- Use `<Button variant="ghost" size="icon">` with `aria-label` for icon buttons.
- Focus management is handled by Radix — do not override `onOpenAutoFocus` unless necessary.

## Anti-patterns

- **Don't** use raw Radix UI imports when a shadcn component already wraps it.
- **Don't** hardcode colors like `bg-blue-500` in components — use semantic tokens (`bg-primary`).
- **Don't** modify files in `components/ui/` for one-off customizations — create wrapper components.
- **Don't** duplicate `cn()` logic inline — always import from `@/lib/utils`.
- **Don't** nest `<button>` inside `<Button>` — use `asChild` instead.
- **Don't** skip `FormField`/`FormItem`/`FormMessage` structure when using `Form` — it wires up error display automatically.

## Integration with Inertia.js

When using shadcn/ui with Inertia.js (Laravel):
- Use `useForm` from `@inertiajs/react` for server-side form submission, shadcn `Form` for client-side validation display.
- Combine both: use `react-hook-form` for validation + `router.post()` or Inertia's `useForm` for submission.
- shadcn `<Link>` conflicts with Inertia's `<Link>` — alias one: `import { Link as InertiaLink } from '@inertiajs/react'`.

## QA Checklist

- [ ] All color usage references CSS variable tokens, not raw values
- [ ] `cn()` used for all dynamic class merging
- [ ] `className` prop forwarded in custom wrapper components
- [ ] Forms use `FormField` + `FormItem` + `FormLabel` + `FormMessage` structure
- [ ] Dialogs include `DialogTitle` for accessibility
- [ ] Icon-only buttons have `aria-label`
- [ ] No `<button>` nested inside `<Button>` — `asChild` used where needed
- [ ] Component files in `components/ui/` not modified for one-off changes
- [ ] Dark mode tokens defined and tested
