# BFF Coffee website

Open `index.html` in a browser to view the site. There is nothing to install.

## Things you'll update most

| What | Where |
|---|---|
| Pop-up dates | The `EVENTS` list at the top of `script.js`. Past dates hide on their own, and the soonest one fills the bar at the top of the page. |
| About story | `index.html`, under the comment `PLACEHOLDER COPY`. |
| Drink descriptions | `index.html`, in the Menu section. The one-line descriptions are drafts. |
| Booking email | `index.html`: search for `gibran.corro05@gmail.com` and replace every match. Do the same in `script.js` (one match). |
| Phone number | `index.html`, Contact section. A comment shows where to add it. |

## Adding photos

Save photos into the `images` folder with these exact names and they appear automatically. Until then, the site shows brand artwork in their place.

| File name | Where it shows | Best shape |
|---|---|---|
| `hero.jpg` | Full-width background at the top of the page | Wide (landscape), at least 1800px across |
| `about-1.jpg` | About section, back-left card | Tall (portrait) |
| `about-2.jpg` | About section, right card (replaces the logo card) | Roughly square |
| `about-3.jpg` | About section, small front card | Wide (landscape) |

## Booking form

The form emails requests through FormSubmit (free, no account). After the site is online, send one test booking. FormSubmit emails an activation link to the booking address; click it once and bookings start arriving.

## Light and dark themes

The sun/moon button in the menu bar switches between the light and dark looks.

- A first-time visitor sees the theme that matches their phone or computer setting.
- Once they click the button, the site remembers their choice on that device.
- To make every first-time visitor start on one theme, open `index.html`, find the line that starts with `if (t !== "light" && t !== "dark") t =` near the top, and replace everything after `t =` with `"light";` or `"dark";`.

## Colors

All colors are listed at the top of `styles.css` in three groups: brand colors used by both themes, the light theme, and the dark theme. Change a value there and it updates everywhere that theme uses it.
