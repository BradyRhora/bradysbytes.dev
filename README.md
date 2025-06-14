# BradysBytes.dev
This is the public repository showcasing my personal website, BradysBytes.dev.
The site is currently a work in progress, so don't expect much.

## About
The initial concept for this site was to showcase my projects and skillset in an interesting and creative way.
To accomplish this, I decided to mimic the look and feel of an old phosphor green terminal.
The first time the page loads, a silly intro is played in which the "user" runs some scripts and authenticates into the "terminal".
This intro will only play once per session as it does take some time.
After "loading", a semi-functional terminal is available at the bottom of the window (if not on mobile) which allows the user to browse directories and enter commands, simulating a Unix terminal. I intend to make the website entirely navigatable using just the terminal, if you so choose, as well as hide some easter eggs in there.

### Terminal Simulator
Currently, aside from basic navigation and system commands (`cd`, `ls`, `pwd`, `help`, and `cat`), the only available command is `style`.
This command accepts a "style file" (.sty) as an argument and will change the terminal colours based on the style file contents.
This change is saved to cookies and will be present on reload.

## Framework
The site is currently running Next.js on my personal server.
