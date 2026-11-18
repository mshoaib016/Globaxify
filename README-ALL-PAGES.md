# Globaxify — All public pages overlay

This ZIP adds missing public routes to your existing Next.js starter. It is an overlay, not a replacement project.

## Install
1. Stop the dev server with Ctrl+C.
2. Extract this ZIP.
3. Copy everything inside `globaxify-all-pages` into your actual Next.js project root (the folder containing `package.json`).
4. If Windows asks to merge folders, choose Yes. Do not replace your existing `app/page.tsx`, `app/layout.tsx`, `components/navbar.tsx`, `components/footer.tsx`, or `lib/site.ts`.
5. Open `app/globals.css.append.txt`, copy its CSS, and paste it at the very bottom of your existing `app/globals.css`.
6. Restart with `npm.cmd run dev`.

## Routes included
/about, /services, six service detail routes, /portfolio, /case-studies, /pricing, /blog, three blog articles, /contact, /get-a-quote, /faqs, /privacy-policy, /terms-and-conditions and a custom 404 page.

## Important
- Existing homepage, layout, design and Supabase admin files are preserved.
- Contact/quote forms open the visitor's email app with a prefilled message. They do not yet save to Supabase.
- Portfolio items are capability examples, not claims of completed client projects. Case studies wait for verified content.
- Legal copy is starter text and should be reviewed for your actual tools and legal obligations.
- This ZIP fixes public website routes. Admin CRUD modules are a separate next phase.
