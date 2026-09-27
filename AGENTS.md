<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Architecture rules

- One family login: all tables scoped by `user_id = auth.uid()`; rows with `user_id IS NULL` are starter templates copied via `seed_family_data` (service role only) — keeps each household private.
- Private storage paths are `{uid}/{profile}/file` in wardrobe-photos, profile-avatars, ai-images — storage RLS checks the first folder.
- Sign-in is a client `AuthGate` in `__root.tsx` wrapping the whole app — every screen is family-only.
- Aura chat streams from `/api/aura-chat` (bearer-verified); memory and self-learned guidelines are saved through model tools per profile — lets Aura improve without extra AI calls.
- AI images stream through `/api/generate-image`; the browser saves the final image to storage — avoids buffering on the server.
