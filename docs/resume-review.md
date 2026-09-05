# Resume review and improvements

Local design and interaction review completed on 6 September 2026. The checks below describe pre-deployment verification.

## Findings addressed

- The desktop monitor grew to the container width while its height was capped independently. It appeared stretched and pushed the tape controls below the fold. The new layout preserves the 4:3 screen and bounds the computer width.
- The opening page presented a machine before it explained Gareth's experience. A readable introduction now sits beside it, with direct links to the resume and PDF, plus existing experience and product-use figures.
- The quick view omitted the work history, capabilities and education already present in the content. Both the standalone page and evidence dialog now include them.
- Product cards had large empty spaces. Small SVG illustrations give each project a visual identity without extra image downloads. IRIS has a source-to-answer diagram and a clearly labelled pilot demo link.
- The terminal input was invisible and suppressed the native mobile keyboard. It is now a labelled, visible question field with an ASK button. Ordinary questions work immediately after boot and from any career tape; the ASK command syntax remains supported.
- The AI index lacked a product overview and the résumé's skills list. Both now derive from the existing public site content, and all embeddings have been refreshed. Unsupported questions use plain wording and do not display unrelated source citations.
- The global keyboard handler intercepted Enter on links and buttons. It now respects those controls. F1/F3/F5/F7 command handling is implemented; F1 was manually verified.
- The resume overlay declared itself modal without native focus containment. It now uses a native dialog, restores focus, locks background scrolling, and keeps its close control separate from navigation.
- Background machine events could be lost while the resume was open. Boot, tape loading and answer completion now continue, with regression tests.
- Sound initially enabled itself. New visitors now start muted; an explicitly saved preference is still respected.
- Motion and CRT effects were stronger than needed. Persistent shelf/map animations were removed, screen haze was reduced, and reduced-motion preferences disable the loading and power effects.
- The email button had white text on a white hover background. Its hover state now retains contrast. The new product-label colours were corrected after an axe audit.
- The profile tape incorrectly described all fifteen pharmacy years as critical care. It now says clinical pharmacy, including intensive care, consistent with the existing resume content.
- Pong is loaded on demand instead of joining the initial interactive bundle.

## Verification

- Local Next.js development server, verified in the Codex in-app browser.
- Desktop visual inspection, including the computer, terminal, evidence dialog, and IRIS section.
- Mobile visual inspection at 390 x 844. The home page had no horizontal overflow.
- Standalone resume inspected at 390 px and checked at 320 px with no horizontal overflow.
- axe-core WCAG 2 A/AA and 2.1 AA audit: no violations in the inspected mobile experience and standalone resume after contrast fixes. This is an automated check, not a full accessibility certification.
- Manual IRIS tape loading, AI starter question, source-link navigation to IRIS, Escape closing and focus restoration, physical F1 directory command, and Enter activation of the keyboard toggle.
- AI answered successfully through the local server at http://localhost:3199. Use this hostname for the preview: the development server normalises its request URL to localhost, so 127.0.0.1 fails the existing same-origin guard. No security checks were relaxed.
- Follow-up question testing covered plain identity, differentiation, product, Python and location questions, the clickable IRIS starter, Enter and ASK submission, first-visit submission without loading a tape, submission from IRIS, and an unsupported Google employment question. Product and Python questions initially failed to find the relevant evidence; both were corrected and retested successfully. The skills citation opens the capabilities section of the résumé. The mobile question field was inspected at 390 px.
- All four starter buttons were checked: identity, differentiation and IRIS return AI answers; the product starter opens the product directory. A typed product question returns an AI answer. The legacy LOAD command also still loads tapes.
- Lint and TypeScript pass. All 110 tests pass, including plain-language command/state regressions and product/skills retrieval cases. Content verification validates 60 knowledge chunks and five tapes. Production build passes.

## Scope and limits

The pre-existing edits to the resume PDF, site content and knowledge content were preserved. The PDF was not regenerated. Public deployment, real device testing, external project functionality, and external video playback were not part of these local checks. Print styles were added to the HTML resume; the existing PDF remains the concise download.

Design review reference: [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md).
