# Using YAML

So far, all the documentation for _configuration files_ have only mentioned [TOML](https://toml.io) as this is our preferred configuration markup language. Still, some people might have other preferrences, and if you're among those who prefer [YAML](https://yaml.org) over TOML, you'll be happy to know that YAML works as well.

To use YAML for a configuration file, just name it `Book.yaml` and write it in YAML instad of TOML. Teaching how to write YAML is beyond the scope of this manual, their website does a really good job of explaining the language and helping you understand it.

## Why We Prefer TOML over YAML

It is important to understand that this is a personal preference. There is nothing wrong with YAML or preferring YAML. It is because we understand that such choices are mostly opinion based, that we offer you the possibility of using YAML instead of TOML.

My main beef with YAML is that I think that [significant whitespace can lead to hard to debug bugs](https://wiki.c2.com/?SyntacticallySignificantWhitespaceConsideredHarmful). It is very easy to end up mismatching the number of spaces needed for indentation and ending up with a file that will not be a valid _book configuration file_. Such bugs are hard to detect with naked eye and often require editors with specialized plugins.

Still, the choice is yours. Do you like YAML? Go for it. I'm committed to supporting it on Little Webby Press.

## Sample configuration using YAML

This is a YAML version of the configuration for the _Moby Dick_ sample.

```yaml
metadata:
  title: 'Moby-Dick, or, The Whale'
  date: 2019-08-08T12:00:00.000Z
  identifier: 'http://www.gutenberg.org/ebooks/2701'
  cover: images/cover.jpg
author:
  name: Herman Melville
  bio: >
    Herman Melville, (born August 1, 1819, New York City—died September 28,
    1891, New York City), American novelist, short-story writer, and poet, best
    known for his novels of the sea, including his masterpiece, Moby Dick
    (1851).
publisher:
  name: Project Gutenberg
site:
  blurb: >
    Moby Dick is the story of Captain Ahab's quest to avenge the whale that
    'reaped' his leg. The quest is an obsession and the novel is a diabolical
    study of how a man becomes a fanatic.But it is also a hymn to democracy.
    Bent as the crew is on Ahab's appalling crusade, it is equally the image of
    a co-operative community at work: all hands dependent on all hands, each
    individual responsible for the security of each.Among the crew is Ishmael,
    the novel's narrator, ordinary sailor, and extraordinary reader. Digressive,
    allusive, vulgar, transcendent, the story Ishmael tells is above all an
    education:in the practice of whaling, in the art of writing. Expanding to
    equal his 'mighty theme' - not only the whale but all things sublime -
    Melville breathes in the world's great literature. Moby Dick is the greatest
    novel ever written by an American.
webmonetization:
  endpoint: $ilp.uphold.com/zdPRwAnyEkmM
toc:
  prefix: h3
  label: h1
  match: first
book:
  frontmatter:
    - 000-front-matter.md
  chapters:
    - 001-loomings.md
    - 002-carpet-bag.md
    - 003-spouter-inn.md
    - 004-counterpane.md
    - 005-breakfast.md
    - 006-street.md
    - 007-chapel.md
    - 008-pulpit.md
    - 009-sermon.md
    - 010-bosom-friend.md
    - 011-nightgown.md
    - 012-biographical.md
    - 013-wheelbarrow.md
    - 014-nantucket.md
    - 015-chowder.md
    - 016-ship.md
    - 017-ramadan.md
    - 018-his-mark.md
    - 019-prophet.md
    - 020-all-astir.md
    - 021-going-aboard.md
    - 022-merry-christmas.md
    - 023-lee-shore.md
    - 024-advocate.md
    - 025-postscript.md
    - 026-knights-squires.md
    - 027-knights-squires.md
    - 028-ahab.md
    - 029-enter-ahab-to-him-stubb.md
    - 030-pipe.md
    - 031-queen-mab.md
    - 032-cetology.md
    - 033-specksnyder.md
    - 034-cabin-table.md
    - 035-mast-head.md
    - 036-quater-deck.md
    - 037-sunset.md
    - 038-dusk.md
    - 039-first-night-watch.md
    - 040-midnight-forecastle.md
    - 041-moby-dick.md
    - 042-whiteness-whale.md
    - 043-hark.md
    - 044-chart.md
    - 045-affidavit.md
    - 046-surmises.md
    - 047-mat-maker.md
    - 048-first-lowering.md
    - 049-hyena.md
    - 050-ahabs-boat-crew-fedallah.md
    - 051-spirit-spout.md
    - 052-albatross.md
    - 053-gam.md
    - 054-town-hos-story.md
    - 055-monstrous-pictures-whales.md
    - 056-less-erroneous-pictures-whales-true-pictures-whaling-scenes.md
    - 057-whales-paint-teeth-wood-sheet-iron-stone-mountains-stars.md
    - 058-brit.md
    - 059-squid.md
    - 060-line.md
    - 061-stubb-kills-whale.md
    - 062-dart.md
    - 063-crotch.md
    - 064-stubbs-supper.md
    - 065-whale-as-dish.md
    - 066-shark-massacre.md
    - 067-cutting-in.md
    - 068-blanket.md
    - 069-funeral.md
    - 070-sphynx.md
    - 071-jeroboams-story.md
    - 072-monkey-rope.md
    - 073-stubb-flask-kill-right-whale.md
    - 074-sperm-whales-head-contrasted-view.md
    - 075-right-whales-head-contrasted-view.md
    - 076-battering-ram.md
    - 077-great-heidelburgh-tun.md
    - 078-cistern-buckets.md
    - 079-prairie.md
    - 080-nut.md
    - 081-pedquod-meets-virgin.md
    - 082-honour-glory-whaling.md
    - 083-jonah-historically-regarded.md
    - 084-pitchpoling.md
    - 085-fountain.md
    - 086-tail.md
    - 087-grand-armada.md
    - 088-schools-schoolmasters.md
    - 089-fast-fish-loose-fish.md
    - 090-heads-or-tails.md
```
