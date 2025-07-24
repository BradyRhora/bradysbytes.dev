# BradysBytes.dev

This is the public repository showcasing my personal website, BradysBytes.dev.
The site is currently a work in progress, so don't expect too much.

## About

The initial concept for this site was to showcase my projects and skillset in an interesting and creative way.
For the style, I decided to mimic the look and feel of an old phosphor green terminal.
The first time the page loads, a silly intro is played in which the "user" runs some scripts and authenticates into the "terminal".
This intro will only play once per session as it does take some time, and can also be skipped by pressing Enter or Space.
After "loading", a semi-functional terminal is available at the bottom of the window (on desktop) which allows the user to browse directories and enter commands, simulating a Unix terminal.
Of course, there's always the option to navigate using links like a *normal* website, but that's no fun.

### Terminal Simulator

Currently, aside from basic navigation and system commands (`cd`, `ls`, `pwd`, `help`, and `cat`), the only available command is `style`.
This command accepts a *style* file (.sty) as an argument and will change the terminal/site theme based on the style file contents.
This change is saved to cookies and will be present on reload.

### Games

The [/games/](https://bradysbytes.dev/games/) directory contains a collection of games I've worked on, mostly as itch.io links.
There's also Phineas and Ferb Heardle, where you guess a song from the show Phineas and Ferb based on a short audio clip, which is hosted directly on the site.
I made this to fill Phineas and Ferb musical trivia shaped hole in my heart.

## Framework

The site is currently running Next.js on my personal server.
