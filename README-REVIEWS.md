# Customer reviews

Run the HTML website with `npm.cmd run preview` and open http://localhost:5501.
Restart the preview command after editing the Node server scripts.

The same-origin `GET /api/reviews` and `POST /api/reviews` endpoints are served by
`scripts/preview.mjs`, using `scripts/reviews-api.mjs`. Customer submissions are
saved to `.data/reviews.json` and survive browser refresh and server restarts.
The storage file is ignored by Git and cannot be downloaded through the static
file server. `REVIEWS_DATA_FILE` can select another persistent filesystem path.

There are ten visible entries. Five come from the existing website and five are
clearly marked layout samples. New submissions displace samples first, then the
oldest displayed entries. Samples are excluded from the rating summary. Stored
reviews are retained even when outside the ten-card display window.

The CSS conveyor repeats an inaccessible clone for a seamless animation, pauses
on hover/focus, offers a pause control, and respects reduced-motion preferences.
Submitted text is rendered with `textContent`, and the API validates lengths,
ratings, content type and origin, with a honeypot and basic submission rate limit.

For public deployment, the host must run this Node API with persistent storage,
or `/api/reviews` must be connected to a durable backend. Static HTML hosting
alone cannot persist shared customer reviews. This local implementation is not
a deployed public review service and does not verify customer identities.

Validation: `node --test scripts/reviews-api.test.mjs`.
