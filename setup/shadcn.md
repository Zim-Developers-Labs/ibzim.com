- after installing shadcn add to globals.css

```css
@theme {
  --color-primaryColor: #eab308;
  --color-secondaryColor: #ff80b5;
  --font-sans: 'Inter', 'sans-serif';
}

html {
  scroll-behavior: smooth;
}
```

- Also for the Dropdown Menu always go to the components/ui/dropdown-menu.tsx and set modal to false to allow scrolling when dropdown is open

Append to the component props

```tsx
<DropdownMenuPrimitive.Root
  data-slot="dropdown-menu"
  {...props}
  modal={false} // add this
/>
```
