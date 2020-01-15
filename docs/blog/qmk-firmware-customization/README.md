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
that you can use to power your own custom keyboard PCB.

The two together yield a keyboard which should last a lifetime while adapting to
the user's changing preferences.

### Tokyo60

The keyboard kit itself is currently only available secondhand or through [Drop
aka Massdrop](https://drop.com). The creator of the board has provided a build
guide here: [Assembly Guide](http://tokyokeyboard.com/tokyo60-assembly-guide/)

### ISP Flashing

I own one Tokyo60 V1 and two V3s. Unfortunately both of my revision 3 boards
shipped without a working bootloader. With some help from the community
([@davidfriar](https://drop.com/profile/davidfriar) specifically) I was able to
successfully flash a new copy of the atmega32u4 bootloader via the PCB's ISP
header.

I followed [@davidfriar's
guide](https://github.com/davidfriar/tokyo60ispflashing/blob/master/README.md)
and everything worked out as expected.

See also:

[QMK ISP Flashing Guide](https://beta.docs.qmk.fm/for-makers-and-modders/isp_flashing_guide)

[Teensy USB Development Board](https://www.pjrc.com/store/teensy_pins.html)

### Custom Configuration

#### Userspace

[QMK Userspace](https://beta.docs.qmk.fm/features/feature_userspace)

##### `config.h`

```c
#pragma once

#ifdef RGBLIGHT_ENABLE
#   define RGBLIGHT_EFFECT_KNIGHT_LENGTH 2
#   define RGBLIGHT_EFFECT_SNAKE_LENGTH 2
#   define RGBLIGHT_LIMIT_VAL 225
#endif // RGBLIGHT_ENABLE

#undef PRODUCT
#ifdef KEYBOARD_toky60
#   define PRODUCT         Lunias Hacked Tokyo60
#endif

// SPACE ??
#define BOOTMAGIC_LITE_ROW 4
#define BOOTMAGIC_LITE_COLUMN 3
```

##### `lunias.h` and `lunias.c`

```c
#pragma once
#include "quantum.h"
#include "version.h"
#include "eeprom.h"
#include "wrappers.h"
#include "process_records.h"
#if defined(RGBLIGHT_ENABLE) || defined(RGB_MATRIX_ENABLE)
#   include "rgb_stuff.h"
#endif

enum userspace_layers {
                       _QWERTY = 0,
                       _NUMLOCK = 0,
                       _QWERTY_FN,
                       _MODS,
                       _GAMEPAD,
                       _DIABLO,
                       _MACROS,
                       _MEDIA,
                       _LOWER,
                       _RAISE,
                       _ADJUST,
};

bool mod_key_press_timer (uint16_t code, uint16_t mod_code, bool pressed);
bool mod_key_press (uint16_t code, uint16_t mod_code, bool pressed, uint16_t this_timer);
void matrix_init_keymap(void);
void shutdown_keymap(void);
void suspend_power_down_keymap(void);
void suspend_wakeup_init_keymap(void);
void matrix_scan_keymap(void);
layer_state_t layer_state_set_keymap (layer_state_t state);
layer_state_t default_layer_state_set_keymap (layer_state_t state);
void led_set_keymap(uint8_t usb_led);
void eeconfig_init_keymap(void);

typedef union {
  uint32_t raw;
  struct {
    bool     rgb_layer_change :1;
    bool     is_overwatch     :1;
    bool     nuke_switch      :1;
    uint8_t  unicode_mod      :4;
    bool     swapped_numbers  :1;
  };
} userspace_config_t;

extern userspace_config_t userspace_config;
```

```c
#include "lunias.h"

userspace_config_t userspace_config;
#if (defined(UNICODE_ENABLE) || defined(UNICODEMAP_ENABLE) || defined(UCIS_ENABLE))
#define LUNIAS_UNICODE_MODE UC_WIN
#else
// set to 2 for UC_WIN, set to 4 for UC_WINC
#define LUNIAS_UNICODE_MODE 2
#endif

bool mod_key_press_timer (uint16_t code, uint16_t mod_code, bool pressed) {
  static uint16_t this_timer;
  if(pressed) {
    this_timer= timer_read();
  } else {
    if (timer_elapsed(this_timer) < TAPPING_TERM){
      tap_code(code);
    } else {
      register_code(mod_code);
      tap_code(code);
      unregister_code(mod_code);
    }
  }
  return false;
}

bool mod_key_press (uint16_t code, uint16_t mod_code, bool pressed, uint16_t this_timer) {
  if(pressed) {
    this_timer= timer_read();
  } else {
    if (timer_elapsed(this_timer) < TAPPING_TERM){
      tap_code(code);
    } else {
      register_code(mod_code);
      tap_code(code);
      unregister_code(mod_code);
    }
  }
  return false;
}

void bootmagic_lite(void) {
    matrix_scan();
    #if defined(DEBOUNCING_DELAY) && DEBOUNCING_DELAY > 0
        wait_ms(DEBOUNCING_DELAY * 2);
    #elif defined(DEBOUNCE) && DEBOUNCE > 0
        wait_ms(DEBOUNCE * 2);
    #else
        wait_ms(30);
    #endif
    matrix_scan();
    if (matrix_get_row(BOOTMAGIC_LITE_ROW) & (1 << BOOTMAGIC_LITE_COLUMN)) {
        bootloader_jump();
    }
}

// Add reconfigurable functions here, for keymap customization
// This allows for a global, userspace functions, and continued
// customization of the keymap.  Use _keymap instead of _user
// functions in the keymaps
__attribute__ ((weak))
void matrix_init_keymap(void) {}

// Call user matrix init, set default RGB colors and then
// call the keymap's init function
void matrix_init_user(void) {
    userspace_config.raw = eeconfig_read_user();

    #ifdef BOOTLOADER_CATERINA
        DDRD &= ~(1<<5);
        PORTD &= ~(1<<5);

        DDRB &= ~(1<<0);
        PORTB &= ~(1<<0);
    #endif

    #if (defined(UNICODE_ENABLE) || defined(UNICODEMAP_ENABLE) || defined(UCIS_ENABLE))
        set_unicode_input_mode(LUNIAS_UNICODE_MODE);
        get_unicode_input_mode();
    #endif //UNICODE_ENABLE
    matrix_init_keymap();
}

__attribute__((weak))
void keyboard_post_init_keymap(void){ }

void keyboard_post_init_user(void){
  // debug_enable=true;
  // debug_matrix=true;
  // debug_keyboard=true;
#ifdef RGBLIGHT_ENABLE
    keyboard_post_init_rgb();
#endif
    keyboard_post_init_keymap();
}

__attribute__ ((weak))
void shutdown_keymap(void) {}

void shutdown_user (void) {
    #ifdef RGBLIGHT_ENABLE
        rgblight_enable_noeeprom();
        rgblight_mode_noeeprom(1);
        rgblight_setrgb_red();
    #endif // RGBLIGHT_ENABLE
    #ifdef RGB_MATRIX_ENABLE
        // uint16_t timer_start = timer_read();
        // rgb_matrix_set_color_all( 0xFF, 0x00, 0x00 );
        // while(timer_elapsed(timer_start) < 250) { wait_ms(1); }
    #endif //RGB_MATRIX_ENABLE
    shutdown_keymap();
}

__attribute__ ((weak))
void suspend_power_down_keymap(void) {}

void suspend_power_down_user(void) {
    suspend_power_down_keymap();
}

__attribute__ ((weak))
void suspend_wakeup_init_keymap(void) {}

void suspend_wakeup_init_user(void) {
    suspend_wakeup_init_keymap();
}


__attribute__ ((weak))
void matrix_scan_keymap(void) {}

// No global matrix scan code, so just run keymap's matrix
// scan function
void matrix_scan_user(void) {
    static bool has_ran_yet;
    if (!has_ran_yet) {
        has_ran_yet = true;
        startup_user();
    }

#ifdef TAP_DANCE_ENABLE  // Run Diablo 3 macro checking code.
    run_diablo_macro_check();
#endif // TAP_DANCE_ENABLE

#ifdef RGBLIGHT_ENABLE
    matrix_scan_rgb();
#endif // RGBLIGHT_ENABLE

    matrix_scan_keymap();
}


__attribute__ ((weak))
layer_state_t layer_state_set_keymap (layer_state_t state) {
    return state;
}

// on layer change, no matter where the change was initiated
// Then runs keymap's layer change check
layer_state_t layer_state_set_user(layer_state_t state) {
    state = update_tri_layer_state(state, _RAISE, _LOWER, _ADJUST);
#ifdef RGBLIGHT_ENABLE
    state = layer_state_set_rgb(state);
#endif // RGBLIGHT_ENABLE
    return layer_state_set_keymap (state);
}


__attribute__ ((weak))
layer_state_t default_layer_state_set_keymap (layer_state_t state) {
    return state;
}

// Runs state check and changes underglow color and animation
layer_state_t default_layer_state_set_user(layer_state_t state) {
    state = default_layer_state_set_keymap(state);
#if 0
#ifdef RGBLIGHT_ENABLE
  state = default_layer_state_set_rgb(state);
#endif // RGBLIGHT_ENABLE
#endif
    return state;
}

__attribute__ ((weak))
void led_set_keymap(uint8_t usb_led) {}

// Any custom LED code goes here.
// So far, I only have keyboard specific code,
// So nothing goes here.
void led_set_user(uint8_t usb_led) {
    led_set_keymap(usb_led);
}

__attribute__ ((weak))
void eeconfig_init_keymap(void) {}

void eeconfig_init_user(void) {
    userspace_config.raw = 0;
    userspace_config.rgb_layer_change = true;
    eeconfig_update_user(userspace_config.raw);
  #if (defined(UNICODE_ENABLE) || defined(UNICODEMAP_ENABLE) || defined(UCIS_ENABLE))
    set_unicode_input_mode(LUNIAS_UNICODE_MODE);
    get_unicode_input_mode();
  #else
    eeprom_update_byte(EECONFIG_UNICODEMODE, LUNIAS_UNICODE_MODE);
  #endif
}
```

##### `process_records.h` and `process_records.c`

```c
#pragma once
#include "lunias.h"

#if defined(KEYMAP_SAFE_RANGE)
#   define PLACEHOLDER_SAFE_RANGE KEYMAP_SAFE_RANGE
#else
#   define PLACEHOLDER_SAFE_RANGE SAFE_RANGE
#endif

enum userspace_custom_keycodes {
    VRSN = PLACEHOLDER_SAFE_RANGE,              // Prints QMK Firmware and board info
    KC_QWERTY,         // Sets default layer to QWERTY
    KC_MAKE,           // Run keyboard's customized make command
    KC_RGB_T,          // Toggles RGB Layer Indication mode
    KC_CCCV,           // Hold to copy, tap to paste
    UC_FLIP,           // (ಠ痊ಠ)┻━┻
    UC_TABL,           // ┬─┬ノ( º _ ºノ)
    UC_SHRG,           // ¯\_(ツ)_/¯
    UC_DISA,           // ಠ_ಠ
    NEW_SAFE_RANGE     //use "NEWPLACEHOLDER for keymap specific codes
};

bool process_record_secrets(uint16_t keycode, keyrecord_t *record);
bool process_record_keymap(uint16_t keycode, keyrecord_t *record);

#define LOWER MO(_LOWER)
#define RAISE MO(_RAISE)
#define ADJUST MO(_ADJUST)
#define TG_MODS TG(_MODS)
#define TG_GAME TG(_GAMEPAD)
#define OS_LWR OSL(_LOWER)
#define OS_RSE OSL(_RAISE)

#define QWERTY KC_QWERTY

#define KC_RESET RESET
#define KC_RST KC_RESET

#define BK_LWER LT(_LOWER, KC_BSPC)
#define SP_LWER LT(_LOWER, KC_SPC)
#define DL_RAIS LT(_RAISE, KC_DEL)
#define ET_RAIS LT(_RAISE, KC_ENTER)

/* OSM keycodes, to keep things clean and easy to change */
#define KC_MLSF OSM(MOD_LSFT)
#define KC_MRSF OSM(MOD_RSFT)

#define OS_LGUI OSM(MOD_LGUI)
#define OS_RGUI OSM(MOD_RGUI)
#define OS_LSFT OSM(MOD_LSFT)
#define OS_RSFT OSM(MOD_RSFT)
#define OS_LCTL OSM(MOD_LCTL)
#define OS_RCTL OSM(MOD_RCTL)
#define OS_LALT OSM(MOD_LALT)
#define OS_RALT OSM(MOD_RALT)
#define OS_MEH  OSM(MOD_MEH)
#define OS_HYPR OSM(MOD_HYPR)

#define ALT_APP ALT_T(KC_APP)

#define MG_NKRO MAGIC_TOGGLE_NKRO

#define UC_IRNY UC(0x2E2E)
#define UC_CLUE UC(0x203D)
```

```c
#include "lunias.h"

uint16_t copy_paste_timer;

__attribute__ ((weak))
bool process_record_keymap(uint16_t keycode, keyrecord_t *record) {
    return true;
}

__attribute__ ((weak))
bool process_record_secrets(uint16_t keycode, keyrecord_t *record) {
    return true;
}

// Defines actions tor my global custom keycodes. Defined in lunias.h file
// Then runs the _keymap's record handier if not processed here
bool process_record_user(uint16_t keycode, keyrecord_t *record) {

  // If console is enabled, it will print the matrix position and status of each key pressed
#ifdef KEYLOGGER_ENABLE
    xprintf("KL: kc: %u, col: %u, row: %u, pressed: %u\n", keycode, record->event.key.col, record->event.key.row, record->event.pressed);
#endif //KEYLOGGER_ENABLE

    switch (keycode) {
    case KC_QWERTY:
        if (record->event.pressed) {
            set_single_persistent_default_layer(keycode - KC_QWERTY);
        }
        break;

    case KC_MAKE:  // Compiles the firmware, and adds the flash command based on keyboard bootloader
        if (!record->event.pressed) {
            uint8_t temp_mod = get_mods();
            uint8_t temp_osm = get_oneshot_mods();
            clear_mods(); clear_oneshot_mods();
            send_string_with_delay_P(PSTR("make " QMK_KEYBOARD ":" QMK_KEYMAP), TAP_CODE_DELAY);
#ifndef MAKE_BOOTLOADER
            if ( ( temp_mod | temp_osm ) & MOD_MASK_SHIFT )
#endif
            {
                #if defined(__arm__)
                send_string_with_delay_P(PSTR(":dfu-util"), TAP_CODE_DELAY);
                #elif defined(BOOTLOADER_DFU)
                send_string_with_delay_P(PSTR(":dfu"), TAP_CODE_DELAY);
                #elif defined(BOOTLOADER_HALFKAY)
                send_string_with_delay_P(PSTR(":teensy"), TAP_CODE_DELAY);
                #elif defined(BOOTLOADER_CATERINA)
                send_string_with_delay_P(PSTR(":avrdude"), TAP_CODE_DELAY);
                #endif // bootloader options
            }
            if ( ( temp_mod | temp_osm ) & MOD_MASK_CTRL) { send_string_with_delay_P(PSTR(" -j8 --output-sync"), TAP_CODE_DELAY); }
#ifdef RGB_MATRIX_SPLIT_RIGHT
            send_string_with_delay_P(PSTR(" RGB_MATRIX_SPLIT_RIGHT=yes OLED_DRIVER_ENABLE=no"), TAP_CODE_DELAY);
#endif
            send_string_with_delay_P(PSTR(SS_TAP(X_ENTER)), TAP_CODE_DELAY);
        }

        break;

    case VRSN: // Prints firmware version
        if (record->event.pressed) {
            send_string_with_delay_P(PSTR(QMK_KEYBOARD "/" QMK_KEYMAP " @ " QMK_VERSION ", Built on: " QMK_BUILDDATE), TAP_CODE_DELAY);
        }
        break;

  case KC_CCCV:                                    // One key copy/paste
        if(record->event.pressed){
            copy_paste_timer = timer_read();
            } else {
            if (timer_elapsed(copy_paste_timer) > TAPPING_TERM) {   // Hold, copy
                register_code(KC_LCTL);
                tap_code(KC_C);
                unregister_code(KC_LCTL);
            } else {                                // Tap, paste
                register_code(KC_LCTL);
                tap_code(KC_V);
                unregister_code(KC_LCTL);
            }
        }
        break;
#ifdef UNICODE_ENABLE
    case UC_FLIP: // (ノಠ痊ಠ)ノ彡┻━┻
        if (record->event.pressed) {
            send_unicode_hex_string("0028 30CE 0CA0 75CA 0CA0 0029 30CE 5F61 253B 2501 253B");
        }
        break;
    case UC_TABL: // ┬─┬ノ( º _ ºノ)
        if (record->event.pressed) {
            send_unicode_hex_string("252C 2500 252C 30CE 0028 0020 00BA 0020 005F 0020 00BA 30CE 0029");
        }
        break;
    case UC_SHRG: // ¯\_(ツ)_/¯
        if (record->event.pressed) {
            send_unicode_hex_string("00AF 005C 005F 0028 30C4 0029 005F 002F 00AF");
        }
        break;
    case UC_DISA: // ಠ_ಠ
        if (record->event.pressed) {
            send_unicode_hex_string("0CA0 005F 0CA0");
        }
        break;
#endif
    }
    return process_record_keymap(keycode, record) &&
#if defined(RGBLIGHT_ENABLE) || defined(RGB_MATRIX_ENABLE)
        process_record_user_rgb(keycode, record) &&
#endif // RGBLIGHT_ENABLE
        process_record_secrets(keycode, record);
}
```

##### `rgb_stuff.h` and `rgb_stuff.c`

```c
#pragma once
#include "quantum.h"
#ifdef RGB_MATRIX_ENABLE
#include "rgb_matrix.h"
#endif

typedef struct {
  bool enabled;
  uint8_t hue;
  uint16_t timer;
  uint8_t life;
} rgblight_fadeout;

bool process_record_user_rgb(uint16_t keycode, keyrecord_t *record);
void scan_rgblight_fadeout(void);
void keyboard_post_init_rgb(void);
void matrix_scan_rgb(void);
layer_state_t layer_state_set_rgb(layer_state_t state);
void rgblight_sethsv_default_helper(uint8_t index);
void rgb_matrix_layer_helper (uint8_t red, uint8_t green, uint8_t blue, uint8_t led_type);
```

```c
#include "lunias.h"
#include "rgb_stuff.h"
#include "eeprom.h"

#if defined(RGBLIGHT_ENABLE)
extern rgblight_config_t rgblight_config;
bool has_initialized;
#endif

#ifdef RGBLIGHT_ENABLE
void rgblight_sethsv_default_helper(uint8_t index) {
    rgblight_sethsv_at(rgblight_config.hue, rgblight_config.sat, rgblight_config.val, index);
}
#endif // RGBLIGHT_ENABLE

#ifdef RGBLIGHT_TWINKLE
static rgblight_fadeout lights[RGBLED_NUM];

void scan_rgblight_fadeout(void) { // Don't effing change this function .... rgblight_sethsv is supppppper intensive
    bool litup = false;
    for (uint8_t light_index = 0 ; light_index < RGBLED_NUM ; ++light_index ) {
        if (lights[light_index].enabled && timer_elapsed(lights[light_index].timer) > 10) {
        rgblight_fadeout *light = &lights[light_index];
        litup = true;

        if (light->life) {
            light->life -= 1;
            if (biton32(layer_state) == 0) {
                sethsv(light->hue + rand() % 0xF, 255, light->life, (LED_TYPE *)&led[light_index]);
            }
            light->timer = timer_read();
        }
        else {
            if (light->enabled && biton32(layer_state) == 0) {
                rgblight_sethsv_default_helper(light_index);
            }
            litup = light->enabled = false;
        }
        }
    }
    if (litup && biton32(layer_state) == 0) {
        rgblight_set();
    }
}

void start_rgb_light(void) {

    uint8_t indices[RGBLED_NUM];
    uint8_t indices_count = 0;
    uint8_t min_life = 0xFF;
    uint8_t min_life_index = -1;
    for (uint8_t index = 0 ; index < RGBLED_NUM ; ++index ) {
      if (lights[index].enabled) {
        if (min_life_index == -1 ||
          lights[index].life < min_life)
        {
          min_life = lights[index].life;
          min_life_index = index;
        }
        continue;
      }

      indices[indices_count] = index;
      ++indices_count;
    }

    uint8_t light_index;
    if (!indices_count) {
        light_index = min_life_index;
    }
    else {
      light_index = indices[rand() % indices_count];
    }

    rgblight_fadeout *light = &lights[light_index];
    light->enabled = true;
    light->timer = timer_read();
    light->life = 0xC0 + rand() % 0x40;

    light->hue = rgblight_config.hue + (rand() % 0xB4) - 0x54;

    rgblight_sethsv_at(light->hue, 255, light->life, light_index);
}
#endif


bool process_record_user_rgb(uint16_t keycode, keyrecord_t *record) {
    if ((keycode >= QK_MOD_TAP && keycode <= QK_MOD_TAP_MAX) || (keycode >= QK_LAYER_TAP && keycode <= QK_LAYER_TAP_MAX)) {
        keycode = keycode & 0xFF;
    }
    switch (keycode) {
#ifdef RGBLIGHT_TWINKLE
        case KC_A ... KC_SLASH:
        case KC_F1 ... KC_F12:
        case KC_INSERT ... KC_UP:
        case KC_KP_SLASH ... KC_KP_DOT:
        case KC_F13 ... KC_F24:
        case KC_AUDIO_MUTE ... KC_MEDIA_REWIND:
            if (record->event.pressed) { start_rgb_light(); }
            return true; break;
#endif // RGBLIGHT_TWINKLE
        case KC_RGB_T:  // This allows me to use underglow as layer indication, or as normal
#if defined(RGBLIGHT_ENABLE) || defined(RGB_MATRIX_ENABLE)
            if (record->event.pressed) {
                userspace_config.rgb_layer_change ^= 1;
                xprintf("rgblight layer change [EEPROM]: %u\n", userspace_config.rgb_layer_change);
                eeconfig_update_user(userspace_config.raw);
                if (userspace_config.rgb_layer_change) {
                    layer_state_set(layer_state); // This is needed to immediately set the layer color (looks better)
                }
            }
#endif // RGBLIGHT_ENABLE
            return false; break;
#ifdef RGBLIGHT_ENABLE
        case RGB_MODE_FORWARD ... RGB_MODE_GRADIENT: // quantum_keycodes.h L400 for definitions
            if (record->event.pressed) { //This disables layer indication, as it's assumed that if you're changing this ... you want that disabled
                if (userspace_config.rgb_layer_change) {
                    // userspace_config.rgb_layer_change = false;
                    xprintf("rgblight layer change [EEPROM]: %u\n", userspace_config.rgb_layer_change);
                    eeconfig_update_user(userspace_config.raw);
                }
            }
            return true; break;
#endif // RGBLIGHT_ENABLE
  }
    return true;
}



void keyboard_post_init_rgb(void) {
#if defined(RGBLIGHT_ENABLE) && defined(RGBLIGHT_STARTUP_ANIMATION)
    if (userspace_config.rgb_layer_change) { rgblight_enable_noeeprom(); }
    if (rgblight_config.enable) {
        layer_state_set_user(layer_state);
        uint16_t old_hue = rgblight_config.hue;
        rgblight_mode_noeeprom(RGBLIGHT_MODE_STATIC_LIGHT);
        for (uint16_t i = 255; i > 0; i--) {
            rgblight_sethsv_noeeprom( ( i + old_hue) % 255, 255, 255);
            matrix_scan();
            wait_ms(10);
        }
    }
#endif
    layer_state_set_user(layer_state);
}

void matrix_scan_rgb(void) {
#ifdef RGBLIGHT_TWINKLE
    scan_rgblight_fadeout();
#endif // RGBLIGHT_ENABLE
}


layer_state_t layer_state_set_rgb(layer_state_t state) {
#ifdef RGBLIGHT_ENABLE
    if (true) {
        switch (biton32(state)) {
            case _QWERTY:
                rgblight_sethsv_noeeprom(128, 10, 255);
                rgblight_mode_noeeprom(RGBLIGHT_MODE_STATIC_LIGHT);
                break;
            case _QWERTY_FN:
                rgblight_sethsv_noeeprom(28, 255, 255);
                rgblight_mode_noeeprom(RGBLIGHT_MODE_BREATHING + 3);
                break;
            case _MACROS:
                rgblight_sethsv_noeeprom_orange();
                userspace_config.is_overwatch ? rgblight_mode_noeeprom(RGBLIGHT_MODE_SNAKE + 2) : rgblight_mode_noeeprom(RGBLIGHT_MODE_SNAKE + 3);
                break;
            case _MEDIA:
                rgblight_sethsv_noeeprom_chartreuse();
                rgblight_mode_noeeprom(RGBLIGHT_MODE_KNIGHT + 1);
                break;
            case _GAMEPAD:
                rgblight_sethsv_noeeprom_orange();
                rgblight_mode_noeeprom(RGBLIGHT_MODE_SNAKE + 2);
                break;
            case _DIABLO:
                rgblight_sethsv_noeeprom_red();
                rgblight_mode_noeeprom(RGBLIGHT_MODE_BREATHING + 3);
                break;
            case _RAISE:
                rgblight_sethsv_noeeprom_yellow();
                rgblight_mode_noeeprom(RGBLIGHT_MODE_BREATHING + 3);
                break;
            case _LOWER:
                rgblight_sethsv_noeeprom_green();
                rgblight_mode_noeeprom(RGBLIGHT_MODE_BREATHING + 3);
                break;
            case _ADJUST:
                rgblight_sethsv_noeeprom_red();
                rgblight_mode_noeeprom(RGBLIGHT_MODE_KNIGHT + 2);
                break;
            default: //  for any other layers, or the default layer
                switch (biton32(default_layer_state)) {
                    case _QWERTY:
                        rgblight_sethsv_noeeprom(128, 10, 255);
                        rgblight_mode_noeeprom(RGBLIGHT_MODE_STATIC_LIGHT);
                        break;
                    case _QWERTY_FN:
                        rgblight_sethsv_noeeprom(28, 255, 255);
                        rgblight_mode_noeeprom(RGBLIGHT_MODE_BREATHING + 3);
                        break;
                    default:
                        rgblight_sethsv_noeeprom_cyan(); break;
                }
                biton32(state) == _MODS ? rgblight_mode_noeeprom(RGBLIGHT_MODE_BREATHING) : rgblight_mode_noeeprom(RGBLIGHT_MODE_STATIC_LIGHT); // if _MODS layer is on, then breath to denote it
                break;
        }
    }
#endif // RGBLIGHT_ENABLE

    return state;
}

#ifdef RGB_MATRIX_ENABLE
extern led_config_t g_led_config;
void rgb_matrix_layer_helper (uint8_t red, uint8_t green, uint8_t blue, uint8_t led_type) {
    for (int i = 0; i < DRIVER_LED_TOTAL; i++) {
        if (HAS_FLAGS(g_led_config.flags[i], led_type)) {
            rgb_matrix_set_color( i, red, green, blue );
        }
    }
}
#endif
```

##### `rules.mk`

```makefile
SRC += lunias.c \
       process_records.c

LINK_TIME_OPTIMIZATION_ENABLE = yes
AUTO_SHIFT_ENABLE = no

ifeq ($(strip $(RGBLIGHT_ENABLE)), yes)
    SRC += rgb_stuff.c
    ifeq ($(strip $(INDICATOR_LIGHTS)), yes)
        OPT_DEFS += -DINDICATOR_LIGHTS
    endif
    ifeq ($(strip $(RGBLIGHT_TWINKLE)), yes)
        OPT_DEFS += -DRGBLIGHT_TWINKLE
    endif
    ifeq ($(strip $(RGBLIGHT_NOEEPROM)), yes)
        OPT_DEFS += -DRGBLIGHT_NOEEPROM
    endif
    ifeq ($(strip $(RGBLIGHT_STARTUP_ANIMATION)), yes)
        OPT_DEFS += -DRGBLIGHT_STARTUP_ANIMATION
    endif
endif

RGB_MATRIX_ENABLE ?= no
ifneq ($(strip $(RGB_MATRIX_ENABLE)), no)
    SRC += rgb_stuff.c
endif

ifdef CONSOLE_ENABLE
    ifeq ($(strip $(KEYLOGGER_ENABLE)), yes)
        OPT_DEFS += -DKEYLOGGER_ENABLE
    endif
endif

ifeq ($(strip $(MAKE_BOOTLOADER)), yes)
    OPT_DEFS += -DMAKE_BOOTLOADER
endif
```

##### `send_unicode.h`

```c
#pragma once

#include "quantum.h"

void send_unicode_hex_string(const char* str);

/* use X(n) to call the  */
#ifdef UNICODEMAP_ENABLE
enum unicode_name {
    THINK, // thinking face 🤔
    GRIN, // grinning face 😊
    SMRK, // smirk 😏
    WEARY, // good shit 😩
    UNAMU, // unamused 😒

    SNEK, // snke 🐍
    PENGUIN, // 🐧
    DRAGON, // 🐉
    MONKEY, // 🐒
    CHICK, // 🐥
    BOAR, // 🐗

    OKOK, // 👌
    EFFU, // 🖕
    INUP, // 👆
    THUP, // 👍
    THDN, // 👎

    BBB, // dat B 🅱
    POO, // poop 💩
    HUNDR, // 100 💯
    EGGPL, // EGGPLANT 🍆
    WATER, // wet 💦
    TUMBLER, // 🥃

    LIT, // fire 🔥
    BANG, // ‽
    IRONY, // ⸮
    DEGREE // °
};


const uint32_t PROGMEM unicode_map[] = {
    [THINK]     = 0x1F914,
    [GRIN]      = 0x1F600,
    [BBB]       = 0x1F171,
    [POO]       = 0x1F4A9,
    [HUNDR]     = 0x1F4AF,
    [SMRK]      = 0x1F60F,
    [WEARY]     = 0x1F629,
    [EGGPL]     = 0x1F346,
    [WATER]     = 0x1F4A6,
    [LIT]       = 0x1F525,
    [UNAMU]     = 0x1F612,
    [SNEK]      = 0x1F40D,
    [PENGUIN]   = 0x1F427,
    [BOAR]      = 0x1F417,
    [MONKEY]    = 0x1F412,
    [CHICK]     = 0x1F425,
    [DRAGON]    = 0x1F409,
    [OKOK]      = 0x1F44C,
    [EFFU]      = 0x1F595,
    [INUP]      = 0x1F446,
    [THDN]      = 0x1F44E,
    [THUP]      = 0x1F44D,
    [TUMBLER]   = 0x1F943,
    [BANG]      = 0x0203D,
    [IRONY]     = 0x02E2E,
    [DEGREE]    = 0x000B0
 };
#endif // UNICODEMAP_ENABLE
```

##### `wrappers.h`

```c
#pragma once
#include "lunias.h"

#if (!defined(LAYOUT) && defined(KEYMAP))
#   define LAYOUT KEYMAP
#endif

#define KEYMAP_wrapper(...)                  LAYOUT(__VA_ARGS__)
#define LAYOUT_wrapper(...)                  LAYOUT(__VA_ARGS__)

    /* 0: QWERTY Default layer
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Esc │  1  │  2  │  3  │  4  │  5  │  6  │  7  │  8  │  9  │  0  │  -  │  =  │  \  │  `  │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ Tab │  Q  │  W  │  E  │  R  │  T  │  Y  │  U  │  I  │  O  │  P  │  [  │  ]  │BkSpc│█████│
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│Ctrl │  A  │  S  │  D  │  F  │  G  │  H  │  J  │  K  │  L  │  ;  │  '  │█████│Enter│█████│
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│Shift│█████│  Z  │  X  │  C  │  V  │  B  │  N  │  M  │  ,  │  .  │  /  │█████│Shift│ Fn  │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│█████│ Gui │ Alt │█████│█████│Space│█████│█████│█████│█████│█████│ Alt │ Gui │█████│█████│
└─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
     */

#define _______________QWERTY_R1_______________        KC_ESC,   KC_1,    KC_2,            KC_3, KC_4, KC_5,   KC_6, KC_7, KC_8, KC_9,    KC_0,    KC_MINS,         KC_EQL,  KC_BSLS, KC_GRV
#define _______________QWERTY_R2_______________        KC_TAB,   KC_Q,    KC_W,            KC_E, KC_R, KC_T,   KC_Y, KC_U, KC_I, KC_O,    KC_P,    KC_LBRC,         KC_RBRC, KC_BSPC
#define _______________QWERTY_R3_______________        KC_LCTRL, KC_A,    KC_S,            KC_D, KC_F, KC_G,   KC_H, KC_J, KC_K, KC_L,    KC_SCLN, KC_QUOT,                  KC_ENT
#define _______________QWERTY_R4_______________        KC_LSPO,           KC_Z,            KC_X, KC_C, KC_V,   KC_B, KC_N, KC_M, KC_COMM, KC_DOT,  KC_SLSH,                  KC_RSPC, MO(_QWERTY_FN)
#define _______________QWERTY_R5_______________                  KC_LGUI, LALT_T(KC_LBRC),             KC_SPC,                                     RALT_T(KC_RBRC), KC_RGUI

    /* 1: QWERTY HHKB Fn layer
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Pwr │ F1  │ F2  │ F3  │ F4  │ F5  │ F6  │ F7  │ F8  │ F9  │ F10 │ F11 │ F12 │ Ins │ Del │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│Caps │ RGB │RGBhi│RGBhd│RGBsi│RGBsd│RGBvi│RGBvd│ Psc │ Slk │ Pus │ Up  │     │     │█████│
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│     │ VoD │ VoU │ Mut │Mply │     │NP_* │NP_/ │Home │PgUp │Left │Right│█████│NPEnt│█████│
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│     │█████│RGBfw│FLIP │TABL │Reset│EERST│NP_+ │NP_- │ End │PgDwn│Down │█████│     │     │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│█████│     │     │█████│█████│█████│     │█████│█████│█████│█████│     │     │█████│█████│
└─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
     */

#define _______________QWERTY_FN_R1_______________        KC_PWR,  KC_F1,   KC_F2,   KC_F3,   KC_F4,   KC_F5,   KC_F6,   KC_F7,   KC_F8,   KC_F9,   KC_F10,  KC_F11,  KC_F12,  KC_INS,  KC_DEL
#define _______________QWERTY_FN_R2_______________        KC_CAPS, RGB_TOG, RGB_HUI, RGB_HUD, RGB_SAI, RGB_SAD, RGB_VAI, RGB_VAD, KC_PSCR, KC_SLCK, KC_PAUS, KC_UP,   KC_TRNS, KC_TRNS
#define _______________QWERTY_FN_R3_______________        KC_TRNS, KC_VOLD, KC_VOLU, KC_MUTE, KC_MPLY, KC_TRNS, KC_PAST, KC_PSLS, KC_HOME, KC_PGUP, KC_LEFT, KC_RGHT,          KC_PENT
#define _______________QWERTY_FN_R4_______________        KC_TRNS,          RGB_MOD, UC_FLIP, UC_TABL, RESET,   EEP_RST, KC_PPLS, KC_PMNS, KC_END,  KC_PGDN, KC_DOWN,          KC_TRNS, KC_TRNS
#define _______________QWERTY_FN_R5_______________                 KC_TRNS, KC_TRNS,                            KC_TRNS,                                     KC_TRNS,  KC_TRNS
```

#### Tokyo60 Keymap

[QMK Keymap Overview](https://beta.docs.qmk.fm/detailed-guides/keymap)

##### `config.h`

```c
#pragma once

#ifdef RGBLIGHT_ENABLE
#   define RGBLIGHT_EFFECT_KNIGHT_LENGTH 2
#   define RGBLIGHT_EFFECT_SNAKE_LENGTH 2
#   define RGBLIGHT_LIMIT_VAL 225
#endif // RGBLIGHT_ENABLE

#undef PRODUCT
#ifdef KEYBOARD_toky60
#   define PRODUCT         Lunias Hacked Tokyo60
#endif

// SPACE ??
#define BOOTMAGIC_LITE_ROW 4
#define BOOTMAGIC_LITE_COLUMN 3
```

##### `keymap.c`

```c
#include QMK_KEYBOARD_H
#include "lunias.h"

/*
 * HHKB Layout
 * Swapped bottom row
 * See users/lunias/wrappers.h
 */

#define LAYOUT_tokyo60_pretty_base_wrapper(...)       LAYOUT_60_hhkb(__VA_ARGS__)

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {

  [_QWERTY] = LAYOUT_tokyo60_pretty_base_wrapper(
                                                 _______________QWERTY_R1_______________,
                                                 _______________QWERTY_R2_______________,
                                                 _______________QWERTY_R3_______________,
                                                 _______________QWERTY_R4_______________,
                                                 _______________QWERTY_R5_______________
                                                 ),

  [_QWERTY_FN] = LAYOUT_tokyo60_pretty_base_wrapper(
                                                    _______________QWERTY_FN_R1_______________,
                                                    _______________QWERTY_FN_R2_______________,
                                                    _______________QWERTY_FN_R3_______________,
                                                    _______________QWERTY_FN_R4_______________,
                                                    _______________QWERTY_FN_R5_______________
                                                    )
};
```

##### `rules.mk`

```makefile
AUDIO_ENABLE			   = no     # Audio output on port C6
BACKLIGHT_ENABLE		   = no     # Enable keyboard backlight functionality
BLUETOOTH_ENABLE		   = no     # Enable Bluetooth with the Adafruit EZ-Key HID
BOOTMAGIC_ENABLE		   = no     # Virtual DIP switch configuration(+1000)
COMMAND_ENABLE			   = no     # Commands for debug and configuration
CONSOLE_ENABLE			   = no     # Console for debug(+400)
EXTRAKEY_ENABLE			   = yes    # Audio control and System control(+450)
INDICATOR_LIGHTS		   = no
MACROS_ENABLED			   = no
MOUSEKEY_ENABLE			   = no     # Mouse keys(+4700)
NKRO_ENABLE				   = yes    # USB Nkey Rollover - if this doesn't work, see here: https://github.com/tmk/tmk_keyboard/wiki/FAQ#nkro-doesnt-work
RGBLIGHT_ENABLE			   = yes    # Enable RGB light
RGBLIGHT_STARTUP_ANIMATION = yes
RGBLIGHT_TWINKLE		   = yes
RGBLIGHT_SLEEP			   = yes

# Do not enable SLEEP_LED_ENABLE it uses the same timer as BACKLIGHT_ENABLE
SLEEP_LED_ENABLE		   = no     # Breathing sleep LED during USB suspend

SPACE_CADET_ENABLE		   = yes
SWAP_HANDS_ENABLE		   = no
TAP_DANCE_ENABLE		   = no
UNICODE_ENABLE			   = yes     # Unicode

Bootloader				   = atmel-dfu
```

<ClientOnly>
  <Disqus shortname="ethanaa" />
</ClientOnly>
