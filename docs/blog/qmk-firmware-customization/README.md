---
sidebar: auto
title: QMK Firmware Customization
date: 2020-01-15 10:04:07
excerpt: |
  Write-up on how I've customized my Tokyo60 keyboards using QMK; including my userspace config 
  and keymap. The latest Tokyo60 V3 shipped to me (and many others) without a bootloader, but 
  I was able to flash it using a Teensy 2.0 development board. I've provided details of that 
  process in case you find yourself in the same situation.
type: post
blog: true
tags:
    - Keyboard
    - Tokyo60
    - QMK
    - Teensy 2.0
---

# January 15th, 2020

## QMK Firmware Customization

I think it was 2008 when I bought my first (and only) [Happy Hacking
Keyboard](https://en.wikipedia.org/wiki/Happy_Hacking_Keyboard). As an
[Emacs](https://www.gnu.org/software/emacs/) user, I find having my control key
on the home row to be essential. Prior to owning an HHKB, swapping caps lock and
control was an OS-specific exercise in tedium. Now, after using an HHKB for so
long, I'm largely dependent on its simple and unique layout.

I love the default HHKB keymap, but being a Topre switch board meant that it was
(and still is) difficult to find compatible keycaps / switches with different
characteristics. Topre switches are some of the best, but not being able to
participate in the Cherry / Gateron / Kailh / ZealPC etc. key switch explosion left
me wondering what I may be missing out on.

Enter the [Tokyo60](https://tokyokeyboard.com/tokyo60/) and [QMK
Firmware](https://beta.docs.qmk.fm/)!

<p align="center"> <img src="./img/qmk_icon.png" width="250" height="250"
  alt="QMK Icon"> </p>

The Tokyo60 is a compact HHKB-style board with a case machined out of anodized
aluminum. It's essentially a fancy Happy Hacking Keyboard with modern features
such as; RGB lighting, a fully programmable layout, and hot-swap key switch
sockets (supporting Cherry MX style switches).

[QMK Firmware](https://beta.docs.qmk.fm/) is an open-source keyboard firmware
that you can use to power your own custom keyboard PCB. QMK is totally
customizable and supports many keyboards and keymaps out of the box. If you're
feeling adventurous; you can even program your own macros, RGB lighting effects,
etc. and flash them to your board.

The two together yield a keyboard which should last a lifetime while adapting to
the user's changing preferences.

### Tokyo60

The keyboard kit itself is currently only available secondhand or through [Drop
aka Massdrop](https://drop.com). The creator of the board has provided a build
guide here: [Assembly Guide](http://tokyokeyboard.com/tokyo60-assembly-guide/)

### ISP Flashing

I own one Tokyo60 V1 and two V3s. Unfortunately both of my revision 3 boards
shipped without a working bootloader. With some much needed help from the
community ([@davidfriar](https://drop.com/profile/davidfriar) specifically) I
was able to successfully flash a new copy of the atmega32u4 bootloader via the
PCB's ISP header.

I followed [@davidfriar's
guide](https://github.com/davidfriar/tokyo60ispflashing/blob/master/README.md)
and everything worked out as expected.

Other references:

[Teensy USB Development Board](https://www.pjrc.com/store/teensy_pins.html)

[QMK ISP Flashing Guide](https://beta.docs.qmk.fm/for-makers-and-modders/isp_flashing_guide)

### Custom Configuration

My configuration is an extension of [@drashna's](https://github.com/drashna)
config (from some time ago now). I've got a few key features implemented:

- Static RGB lighting (single color)
- Flash RGB lighting on FN hold (alternate color)
- RGB twinkle effect when typing
- Braces can alternately be typed by pressing modifiers
  - Shift == Parentheses
  - Alt == Square brackets
  - Shift + Alt == Brackets

#### Userspace

[QMK Userspace](https://beta.docs.qmk.fm/features/feature_userspace)

My userspace configuration: [users/lunias](https://github.com/lunias/qmk_firmware/tree/master/users/lunias)

#### Tokyo60 Keymap

[QMK Keymap Overview](https://beta.docs.qmk.fm/detailed-guides/keymap)

My tokyo60 keymap: [keyboards/tokyo60/keymaps/lunias](https://github.com/lunias/qmk_firmware/tree/master/keyboards/tokyo60/keymaps/lunias)

<ClientOnly>
  <Disqus shortname="ethanaa" />
</ClientOnly>
