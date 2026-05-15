# 6.30.0

## New Features

* Trigger `clpp.events.CAST_VISIBILITY_CHANGED` event on Chromecast sender when
  Chromecast Receiver App transitions to background or foreground on Google TV Streamer.

## Changes

* Fix `disableCustomPlayback` configuration option of IMA SDK Plugin on webOS devices which can be used to disable the plugin.
* Fix support for VAST in IMA SDK plugin on SmartTV Devices.
   * Add `isVast` configuration option of IMA SDK Plugin for custom playback with single video element when using VAST ads. 
     This option needs to be set to `true` in order for VAST to work on Smart TVs. 
     See https://demo.castlabs.com/docs/advertising#ima-sdk-on-smart-tvs
* Fix sending of custom messages from Chromecast receiver to sender.
   * If you send an object `clpp.cast.CastProxy#addMessageListener(listener)`
    listener now receives the object instead of a serialized string version of it
    as it did previously.
* Fix ads API on Chromecast sender for ad playback on receiver. Specifically fix
  methods to pause and resume ad playback via `player.getAdsManager().pause()`
  and `player.getAdsManager().resume()` on sender.

# 6.29.0

## New Features

* Add `clpp.cast.playlist.CastPlaylist`. Use this class to create and manage playlists in Cast.
  See https://demo.castlabs.com/docs/cast#cast-playlist for more information.

## Changes

* Fix HLS EXT-X-DATERANGE parsing when multiple tags have the same ID.
  Omitting already defined attributes is now allowed.
* Fix IMA SDK Plugin mid-roll behavior on Tizen Smart TV devices.
* Expose Google Cast `audioTrackInfo` and `roles` on `Track`'s `customData` property.
* Add support for multiple HLS interstitials with the same start date.

# 6.28.0

## **Warning**

DRMToday onboard component now uses Widevine V2 certificate by default.
If your deployment uses a different Widevine server certificate, you need to specify it via `drm.customData.serverCertificate`
or pass in `null` to configure the component to fetch the certificate from the server before a license request.

For more information, see https://demo.castlabs.com/docs/drm#drm-with-drmtoday-onboard.

## New Features

* DRMToday onboard component now uses Widevine V2 certificate by default.
* Trigger error events for network errors that get retried.

## Changes

* Fix timeline calculation for certain live DASH streams with thumbnails.

# 6.27.0

## New Features

* Add support for Queuing on Chromecast.
  * For more details refer to docs https://demo.castlabs.com/docs/cast#queuing
* Add CMCD support (version 1).

## Changes

* Fix an issue with `player.getStats()` which crashes for audio-only streams.
* Fix support for HLS playlists with beacon URLs that do not have a file extension.
* Fix HLS live audio/video out-of-sync issue. The playlists are now aligned
  when there are different EXT-X-PROGRAM-DATE-TIME tags on first segments.
* Add polyfills for Tizen 2.3.

# 6.26.1

## Changes

* Request URI used in network request and response modifiers is not modified.
  * If the URI was specified without scheme, it stays without scheme.

# 6.26.0

## New Features

* Add support for audio and subtitle track language in NPAW v7 plugin.
  * The language information is sent in the ping request.
* Add support for custom label for disabled subtitles in NPAW v7 plugin.
  * The label can be configured via `youbora.disabledSubtitlesLabel` config option.

## Changes

* Update docs of IMA Plugin stating limitations on SmartTV devices.
  * Refer to the [IMA Plugin](https://demo.castlabs.com/docs/advertising#ima-sdk-smarttv-support) documentation for more information.
* Fix an null pointer issue which occurs when a dynamic manifest turns static.

# 6.25.2

## Changes

* Fix `EXT-X-DEFINE` support for media segment URIs in HLS.
* Fix issues with HLS interstitials mainly related to seeking.
* Fix an issue in switching between muxed and separate audio tracks in HLS.
* Fix an issue of IMA Plugin causing player video events not to propagate after an ad break on Smart TV devices.
* Fix an issue of IMA Plugin causing player not resume playback after mid-roll on Smart TV devices.
* Handle situation of HLS interstitials of X-PLAYOUT-LIMIT updated when interstitial is already bound.

# 6.25.1

## New Features

* Add config option `streaming.gapTolerance`.
* Add support for IMA SDK Plugin on webOS devices.
  * Refer to the [IMA Plugin](https://demo.castlabs.com/#/docs/advertising#ima-sdk-smarttv-support) documentation for more information.

## Changes

* Fix an issue with playing media playlists directly with media segment file
  extension `.m4f` in HLS.
* Fix issues with preroll sometimes not playing with IMA SDK Plugin on Tizen and WebOS devices.
* Fix issues with the IMA SDK plugin on Tizen where the main content fails to resume at the correct position after a mid-roll ad.
* Fix support for METHOD AES-128 encryption in HLS.
* Fix an issue with AirPlay on iOS when switching between DASH and HLS playback.
* Fix `streaming.disableAudioTracks` config option for multi-period streams.
* Support EXT-X-DEFINE tags anywhere in the playlist in HLS.
* Fix issues with `setDrmCustomDataModifier()` in AirPlay related to loading
  a new stream during na AirPLay session.
* Fix an issues with upper case values of `Content-Type` HTTP header in media
  segment responses in HLS.
* Fix positioning of WebVTT subtitles based on the base direction of text.
  * `align:start` and `align:end` in WebVTT now respect the base direction.

# 6.25.0

(We released 6.25.1 instead)

# 6.24.0

## New Features

* Improve support for HLS interstitials.
* Add support for HLS streams containing both separate and muxed audio tracks.

## Changes

* Disable console logs by default. To enable logs call `clpp.log.setLogLevel(clpp.log.Level.INFO);`
  or refer to [debugging docs](https://demo.castlabs.com/#/docs/getting_started#debugging)
* Fix a issue with fMP4 HLS where init segments are re-fetched unnecessarily.
* Fix support for `EXT-X-MEDIA` `DEFAULT` attribute in HLS.

# 6.23.1

## Changes

* Change default EME version on Safari with native player to Apple-prefixed EME.
  This fixes issues with playback of encrypted content in that setting.
  On Safari with MSE player the default EME version stays unchanged (standard
  EME).

# 6.23.0

## New Features

* Add `drmResolver` config option which can be used to provide DRM configuration
  dynamically based on data from the manifest.
* Add ability to retrieve instance of NPAW SDK `getNpawPlugin`.
  * Can be used e.g. to set custom options using `setAnalyticsOptions`, for more details refer to [NPAW v7 docs](https://demo.castlabs.com/#/docs?q=clpp.npaw.NpawPlugin#getNpawPlugin).

# 6.22.0

## New Features

* Add `streamType` option to the Yospace plugin.
* Emit SVTA signalling metadata for HLS interstitial ads.

## Changes

* Fix an issue with HLS interstitials with `X-ASSET-URI` and
  undefined `X-RESUME-OFFSET`.
* Make sure the IMA plugin does not play postroll ads of the previous source
  when a new sources is loaded or after the player is released or destroyed.
* Fix support for `CUE=PRE` and `CUE=POST` in HLS interstitials.
* Improve Chromecast performance of low latency streaming.
* Fix initialization issue with NPAW v7 plugin when using the npm package.

# 6.21.0

## **Warning!**

Changes in this release might be breaking for some very specific use cases:

* Change the default EME API version used by the player on Apple devices from
  the Apple-prefixed EME (`clpp.drm.eme.EmeFactory.Apis.APPLE`) to
  the standard EME (`clpp.drm.eme.EmeFactory.Apis.STANDARD`).
  If needed, this can be changed back by configuring `drm.emeApi: clpp.drm.eme.EmeFactory.Apis.APPLE`.

## New Features

* Add Yospace plugin.
* Support playback of CENC-protected DASH and SMOOTH content
  on Safari.
* Add the `mse.sendPlaybackSessionIdHeader` config option which when enabled
  adds the `X-Playback-Session-Id` header to every playback-related HTTP
  request of the MSE player.
* Add support for the `_HLS_primary_id` query param for HLS interstitials.
* Add integration for NPAW SDK v7 (Youbora).
  * Supported version 7.3.4, for more details refer to [NPAW v7 docs](https://demo.castlabs.com/#/docs/analytics#npaw-v7-youbora).
* Add support for License Acquisition URL elements `<dashif:Laurl>`
  in DASH.

## Changes

* Switch to using default Shaka version instead of fixed version 4.3.4 for CC receiver.
  * CAF's version of Shaka Player now follows default.
* Fix support for License Acquisition URL elements `<urn:microsoft:laurl>`
  in Widevine-protected DASH.
* Fix an issue with ABR bandwidth estimation.
* Update least supported version of NPAW SDK v7 integration to v7.3.8.

# 6.20.0

## **Warning!**

Changes in this release might be breaking for some very specific use cases:

* Disallow passing a config with the `license` attribute into `player.load()`
  and throw an error if it happens. License is intended to be passed into
  the player constructor only.

## New Features

* On Safari with native player improve support for timeline cues:
  * Support cues in live streams.
  * Expose client-defined attributes, i.e. attributes with the prefix "X-"
    coming from EXT-X-DATERANGE.
  * Correctly trigger `TIMELINE_CUE_ENTER` and `TIMELINE_CUE_EXIT` events
    in case of overlapping cues and cues with unknown duration.

## Changes

* Recognize MP3 file extension.
* Fix the payload of ad events emitted for HLS interstitial ads.
* Fix audio and subtitle track selection when casting to Chromecast devices.

# 6.19.1

## Changes

* Fix an issue with error events for HTTP error responses on Firefox during
  streaming.

# 6.19.0

## New Features

* Add support for CMSD (Common Media Server Data)
  * When `CMSD-Dynamic` or `CMSD-Static` header is parsed from network request, player now emits event `clpp.events.CMSD_EVENT`.
    * For details refer to [CMSD Event](https://demo.castlabs.com/#/docs?q=clpp.events#CMSD_EVENT).
  * MSE player now also supports CMSD headers **estimatedThroughput** and **maxSuggestedBitrate** to drive its ABR decisions.
    * For details refer to [config.abr.useCmsd](https://demo.castlabs.com/#/docs?q=clpp#AbrConfiguration).
* Add `clpp.events.TIMELINE_CUES_CHANGED` event indicating a change in timeline cues.
* Support EXT-X-DATERANGE augmentation in HLS.
* Add Chromecast Web Receiver methods `setContentMetadata`, `updateContentMetadata` supporting set or
  merge the current content metadata.
* Add support for HLS interstitials.

## Changes

* Evict old timeline cues in live streams.
* Allow extra whitespaces in HLS playlists.
* Fix a problem with text track selection when `preferForcedSubtitles` is configured.
* Fix typescript typings of utility functions.
* For Low Latency streams and `lowLatencyMode` the streaming configuration `ignoreDrift` is now `false` by default
  * `ignoreDrift` could cause additional startup delay for some streams. In case you still want to disable drift detection for
     low latency streams, set `ignoreDrift` of [streaming configuration](https://demo.castlabs.com/#/docs?q=clpp#StreamingConfiguration).

# 6.18.0

## New Features

* Add startover timeline type for DASH which supports seeking back to the start
  of the stream. Enable this timeline mode by configuring
  `manifest.timeline.type: "startover"` for startover streams.
* Make Widevine key system version configurable via `drm.widevineVersion` to allow
  for the selection of experimental key systems such as `com.widevine.alpha.experiment`.
* Support multiple HLS EXT-X-MAP tags in a playlist.
* Upgrade supported version of `youboralib` to 6.8.59. Please upgrade to this version (e.g. `npm i youboralib@6.8.59`).
* Support EXT-X-DATERANGE tags in Live HLS Streams.

## Changes

* Improve DRM logs.
* Fix an issue with segment eviction in startover DASH.
* Fixed handling of same GROUP-IDs across different media types in HLS.
* Fix an event `clpp.events.BITRATE_CHANGED` which wasn't properly triggered.
* Fix session initialization in the Broadpeak plugin.
* Update DRMToday Widevine server certificate.
* Fix reporting of bitrate by Conviva Analytics Plugin.
* Fix crash in repeated calls to `load()` on Tizen 4 and 5.

## Known Issues

* Breaking change of latest [Google Cast SDK Web Receiver version 3.0.0137](https://developers.google.com/cast/docs/release-notes#september-4,-2024-november-1,-2024)
  * Causes a regression in audio and subtitle track selection when casting to Chromecast devices. Tracks appear disabled during the casting session.
  * Affects all SDK versions.

# 6.17.1

## Changes

* Fix ABR bandwidth estimation between repeated calls to load.

# 6.17.0

## New Features

* Add support for the `EXT-X-DEFINE` tag in HLS.

## Changes

* Fix `clpp.Player.getTextDisplayer()` API.
* Fix docs of `clpp.Player.setMuted()` API.
* Fix handling of empty attribute values in HLS.
* Upgrade supported version of `youboralib` to 6.8.57. Please upgrade to this version (e.g. `npm i youboralib@6.8.57`).
* Fix a corner case with HLS VOD streams in which `EXT-X-DATE-RANGE` tags are
  not being parsed when program date time is equal to the start of Unix epoch.
* Add support for `EventStream@presentationTimeOffset`
  * If present, `presentationTimeOffset` attribute is now used to calculate the presentation time of Events.

# 6.16.0

## New Features

* Add support for smooth codec switching in multi-codec AdaptationSet scenarios.
	* This support is disabled by default and can be enabled by configuring `config.mediaSource.codecSwitchingStrategy` to `clpp.CodecSwitchingStrategy.SMOOTH`.
	* Smooth codec switching is only supported on platforms compatible with `SourceBuffer.changeType()` and is currently limited to sources that do not require transmuxing. It's also disabled by default on platforms known to have issues with `SourceBuffer.changeType()`; currently, this applies to Tizen 6.0 and 6.5 though the list may be expanded in the future.
  * For more details, refer to [clpp.MediaSourceConfiguration](https://demo.castlabs.com/#/docs?q=clpp#MediaSourceConfiguration)
    and [clpp.CodecSwitchingStrategy](https://demo.castlabs.com/#/docs?q=clpp#CodecSwitchingStrategy).

## Changes

* Fix an LL-HLS issue of playback stuck on buffering after first segment.

# 6.15.0

## New Features

* Add `clpp.events.LIVE_TURNED_STATIC` event triggered when a live stream
  becomes static.

## Changes

* Fix an issue with some timeline cue events not being emitted for cues which
  coincide with a gap between media segments.
* Fix an issue with playback of certain multi-period MPEG-TS HLS streams.
* Fix support of VAST Ads of IMA SDK Plugin.
  * VAST Ads are now supported and scheduled as a pre-roll.

# 6.14.1

## Changes

* Improve error handling of the `load()` method.
* Fix an issue on Safari where the player might get paused after seeking to
  the very end of the video.
* Fix an issue with the player going to ENDED state early.
* Fix an issue where Tizen devices misreport AC-3 support for encrypted content.

# 6.14.0

## New Features

* Add support for MPEG-DASH trick mode Adaptation Sets (i.e. those marked with an EssentialProperty descriptor with URL "http://dashif.org/guide-lines/trickmode").
   * If such Adaptation Sets are present in the MPD, they are listed as separate [Tracks](https://demo.castlabs.com/#/docs?q=clpp.Track) by the [clpp.TrackManager#getVideoTracks()](https://demo.castlabs.com/#/docs?q=clpp.TrackManager#getVideoTracks) and marked with the `clpp.Track.trickPlay` flag set to `true`.
   * These tracks and all their renditions are available only for manual selection using methods from [clpp.TrackManager](https://demo.castlabs.com/#/docs?q=clpp.TrackManager).
   * At the moment, trick play tracks are completely ignored by ABR, meaning their renditions are not considered for automatic selection when the normal track associated with this trick play track is active. It is also not possible to enable ABR when the currently active track is a trick play track.
   * For details, refer to the [clpp.Track.trickPlay](https://demo.castlabs.com/#/docs?q=clpp.Track#trickPlay) documentation.
* Add support for forced subtitles.
   * For text tracks recognized as forced [clpp.Track.kind](https://demo.castlabs.com/#/docs?q=clpp.Track#kind) is set to `"forced"`.
   * Added [config.preferForcedSubtitles](https://demo.castlabs.com/#/docs?q=clpp.PlayerConfiguration#preferForcedSubtitles) to prioritize forced subtitles over other text track types when `config.preferredTextLanguage` is also provided.
   * If `config.preferredTextLanguage` is not specified, but the `config.preferForcedSubtitles` is set to `true` we first try to fallback to the language from the currently selected audio track. If there is no audio track, then we fallback to the language of the video track as a last resort.
   * We assume that the forced subtitles are a subset of the full subtitles for the same language, i.e., all forced subtitles events should be included within the corresponding full subtitles. When the normal subtitles are being disabled, the corresponding forced subtitles in the same language are enabled automatically.

## Changes

* Fix issues with live presentation delay when `lowLatencyMode` is `true`.
  * Fix `suggestedPresentationDelay` config option.
  * Make sure presentation delay gets set to 0 by default in DASH.
* Fix support for `timescale` attribute of thumbnail streams in DASH.
* Add Mux Data Plugin method to send custom events using `emit` method
  * For details refer to [Mux Data Analytics Docs](https://demo.castlabs.com/#/docs/analytics#custom-events)
* Upgrade supported version of Broadpeak Plugin.
  * Minimum recommended version is now v5.0.1-4c69e21. Refer to Analytics Documentation for details.
* Add support for [session precache](https://delivery-platform.broadpeak.tv/smartlib/public/advanced-features/precache/) to the Broadpeak plugin.
  * This fixes issues with client side ad insertion with pre-rolls.
* Fix CMSD header parsing to be case insensitive.
* Fix `clpp.SpeedUpMode` enum missing `DECODER` value.
* Update minimum recommended version of Mux Data SDK to 4.30.0
  * Refer to [Mux Data Analytics Documentation](https://demo.castlabs.com/#/docs/analytics#mux-data) for details.

# 6.13.0

## New Features

* Add configuration options `cl.api.TrickPlayConfiguration` to control the behavior of trick play.
  * `trickPlay.speedUpMode` to control the mode of trick play `decoder` or `seek`
  * `trickPlay.preferTrickPlayTracks` to control the default selection of trick play tracks
  * `setPlaybackRate` method now accept optional `speedUpMode` parameter [clpp.Player docs](https://demo.castlabs.com/#/docs?q=clpp.Player#setPlaybackRate).
  * For details refer to [trick play configuration](https://demo.castlabs.com/#/docs?q=clpp#TrickPlayConfiguration).

## Changes

* Fix an issue where specific live/IPR DASH streams get stuck buffering at
  the end of the live stream instead of properly ending.
* Fix the issue introduced in 6.11.0 that causes the player to report error `1007`
  instead of `1001` in case of a network error.
* Emit recoverable error events from player in case thumbnails fail to load
  or wrong configuration is used.
* Improve behavior of Trick Play:
  * Improve fallback to seek mode when native trick play is not supported by platform (negatives rates, high speed trick play modes).
  * Added workaround for Tizen devices, fixing situation when reverse rate played frames forward during trick play.

# 6.12.0

## New Features

* Spatial audio detection and configuration:
  * Added detection of E-AC3 JOC audio content using DD+JOC signaling.
  * Added `clpp.Track.spatialAudio` value to indicate spatial audio content.
  * Added `config.preferSpatialAudio` to support manual prioritization of spatial audio.

## Changes

* Fix support for CR and CRLF line endings on Safari related to configs
  `safari.enableHlsVideoTrackInfo` and `safari.enableMetadata`.
* Fixed position attribute of the `clpp-fill` css class and made it `absolute`
* Fixed issue with typescript types where namespace functions were not exposed
* Fixed issue with ESM module dependencies where required files were not automatically imported
* Fixed issue of fetching extra media segment to account for possible positive drift
  * Added detection of positive drift (difference between manifest and media segment time) and fetch extra media segment only when needed.

# 6.11.0

## New Features

* Add the `clpp.install` API which is now the official API for installing
  components and adding player capabilities. Components can be uninstalled
  via `clpp.uninstall`.
* Add support for TTMLv2 `tts:textShadow` style attribute.

## Changes

* Fix issue when parsing PlayReady PSSH data.
* Make Widevine robustness configurable on Android Chrome.
* Fixed issue when parsing directly embedded PlayReady Header Objects.
* Fix support for multiple parallel player instances.
* Stop using the DASH attribute `minBufferTime` to decide the minimum buffer
  size. Note that the existing config `streaming.rebufferingGoal` should be
  used for that purpose instead.

## Deprecations

* The `clpp.Player.use` and `clpp.Player.remove` API is now deprecated and will
  be removed in version 7.0.0, use `clpp.install` and `clpp.uninstall` instead.
* The third parameter of `clpp.persistent.fetchLicense` is now deprecated and
  will be removed in version 7.0.0, use `clpp.install` instead.

# 6.10.0

## New Features

* Add Tracks original language value from manifest
   * Extend `clpp.Track` with `clpp.Track.originalLanguage` value which contains the original language string as it is present in manifest.
   * For details refer to [Track](https://demo.castlabs.com/#/docs?q=clpp.Track).
* Add support for the `EXT-X-PROGRAM-DATE-TIME` tag in live HLS to the MSE
  player. If the tag is present its value is now accessible via
  `player.getTimelineOffset().seekRangeStartDateTime`. The timeline offset can
  be used to display wall-clock time in the UI like so:
  ```js
  const offset = player.getTimelineOffset();
  if (offset) {
    // Get the wall-clock values for UI
    const position = player.getPosition() + offset.offsetDateTime;
    const start = player.getSeekRange().start + offset.offsetDateTime;
    const end = player.getSeekRange().end + offset.offsetDateTime;
  }
  ```
* Add support for fetching decryption keys from DRMtoday for
  clear-key-encrypted HLS content (`METHOD=AES-128`).
* Add support for Widevine EME configuration options
  * `persistentState` can be configured via the boolean option
    `drm.customData.widevinePersistentStateRequired`
  * `distinctiveIdentifier` can be configured via the boolean option
    `drm.customData.widevineDistinctiveIdentifierRequired`


## Changes

* Added `PlayerSurface` option to control webOS long startup patch `webOSStartupPatch`
  * This patch could cause unexpected behavior for specific player setups.
  * For details refer to [PlayerSurface Configuration](https://demo.castlabs.com/#/docs/surface#disabling-webos-startup-optimization).
* Fix a glitch where WebVTT XML tags were being displayed along with the subtitle
  text in case of WebVTT subtitles embedded inside of MP4 media files.
* Fix an issue of the `HtmlCueComponent` where some subtitle cues were not begin
  displayed in case of overlaps in segmented subtitles.
* Improve support of discontinuous HLS streams.

# 6.9.0

## New Features

* Add config option `streaming.ignoreManagedMediaSourceStreamingHints` to ignore
  hints generated by Managed Media Source (MMS) `startstreaming` and
  `endstreaming` events. Default `false` optimizes for both performance and
  resource management, particularly in varied network conditions and on
  constrained devices, where managing power consumption and network efficiency
  is crucial. Use with caution as enabling this option could lead to increased
  power usage, making the default disabled setting a safer choice for general
  use cases.

## Changes

* HLS fixes:
  * Fix support for URIs with missing file extensions in discontinuous HLS.
  * Fix sporadic crashes in discontinuous live streams which contain
    thumbnails or subtitles.
  * Fix playback of MP4 streams with large baseMediaDecodeTime values.
* Additional Meta-Data such as accessibility information are no longer
  fetched by default with the Safari Native Player implementation. This
  behavior can be re-enabled by setting `enableMetadata` to `true` in the
  [Safari Configuration](https://demo.castlabs.com/#/docs?q=clpp#SafariConfiguration).
* Fixed issue with Safaris native track selection where the player would
  sometimes mark the wrong track as selected.

# 6.8.0

## New Features

* Add support for Managed Media Source (MMS).
* Add support for changing initialization sections and encryption in
  discontinuous VOD HLS.
* Add config options `streaming.disableAudioTracks` and `streaming.disableVideoTracks`
  to disable audio and video of the MSE Player (not applicable to Safari or Tizen
  native playback).
* Add config option `drm.ignoreUnrecognizedInitData`. If the player encounters init data
  that cannot be processed (e.g., due to a malformed data payload), it will not pass it
  to the CDM to avoid license requests errors. This option allows to disable this behavior
  and pass the init data even if we couldn't parse it.
* Add IMA SDK support to MSE player on Tizen devices.
  * **Warning!** There are limitations related to analytics reporting for IMA SDK Plugin and SmartTV devices. Refer to the [IMA Plugin](https://demo.castlabs.com/#/docs/advertising#ima-sdk-smarttv-support) documentation for more information.
* Add Mux Data Plugin support for [Bandwidth Throughput Events](https://docs.mux.com/guides/mux-data-playback-events#bandwidth-throughput-events).

## Changes

* Improve handling of segment duration drift in multi-period content.
* Fix track switching in audio-only content.

# 6.7.0

## Changes

* HLS related fixes:
  * Fix corner cases in the handling of segment byte ranges.
  * Improve playlist validation and support check.
  * Low latency support:
    * Fix playlist validation with respect to `#EXT-X-SERVER-CONTROL:PART-HOLD-BACK`.
    * Fix handling of low-latency playlist segments when low-latency support is
      disabled (It is disabled by default).
* Fixed Chromecast Cast Web Sender track manager issue, restoring the ability to list and change text/audio tracks during casting.

# 6.6.1

## Changes

* Fix methods `clpp.utils.Mp4Parser.children()`, `clpp.utils.Mp4Parser.sampleDescription()`
  and `clpp.utils.Mp4Parser.headerSize()`.
* HLS related fixes:
  * Improve MIME type detection by leveraging `#EXT-X-MAP` tags.
* Fixed issue with some Smooth Streaming playback scenarios where the timeline
  was adjusted but the wrong base media decode time was used.
* Fixed minor issue with Youbora receiving consecutive buffering ended events during
  ad playback. The state was tracked already internally so these events were not
  reported and this has not affect on the data exposed to Youbora. It makes the internal
  implementation more consistent though and is slightly more performant since we are
  saving some calls.

# 6.6.0

## New Features

* Expose accessibility information for audio and text tracks on Safari.
  Note that in order for this feature to work `NAME` attributes
  of `#EXT-X-MEDIA` must be unique in the HLS playlist.

## Changes

* Upgrade supported version of Broadpeak Plugin.
  * Minimum recommended version is now v04.05.01-328cb1e. Refer to Analytics Documentation for details.

# 6.5.0

## New Features

* Add an option for filtering of Youbora error events. Configure a custom
  error filter via the `youbora.errorFilter` config option.
* Add new configuration options of 360-degree video playback `clpp.VrConfiguration`.
  * `vr.sensitivity` sets the mouse/touch controls sensitivity. Must be a positive number.
  * `vr.invertHorizontalControl` inverts the mouse/touch movement for horizontal axis.
  * `vr.invertVerticalControl` inverts the mouse/touch movement for vertical axis.

## Changes

* Upgrade supported version of `youboralib` to 6.8.49. Please upgrade to this version (e.g. `npm i youboralib@6.8.49`).
* Fixed issue with parsing WV PSSH data from Version 1 PSSH boxes
* Fixed persistent license removal
* Added `enableSessionCacheForSkd` as an option to the DRM Configuration.
  We encountered issues with FairPlay in native Safari when SKD initialization
  is used. What happens is that we do received multiple requests for the same
  key request from the native engine and if we are not full-filling the
  requests, it can cause a decryption error.
  The default implementation ignores the session cache and will handle each
  `encrypted` event. In this case, there might be duplicated
  requests triggered by the player for license keys that were already fetched.
  This is done to avoid any potential decryption errors. Setting this option to
  true will enable the session cache also for SKD init data and avoid any
  redundant license requests. **Note** that you might encounter more 3016 decode
  errors on Safari with native playback and SKD initialization when enabling the
  session cache.
* Work around a Safari 16.5 issue where in certain cases HLS live streams do
  not start playback at current time (live edge) as they should, but instead
  they start some time in the past.
* Fix an issue with the import of Broadpeak SDK occurring when code is bundled
  with a bundler, which performs hoisting of import statements (such as Webpack).

# 6.4.1

## **Warning!**
Changes in this release might be breaking for some very specific use cases:
* Removed `clpp.EventBus` from the API. *It is unlikely that this will cause
  any issues, since this API is not intended to be public and is not relevant
  to player functionality.*

## New Features

* Add an option to enable detailed video track info and player stats for HLS on Safari.
  To enable this experimental feature configure `safari.enableHlsVideoTrackInfo: true`.

## Changes

* Fix the `textStyle` config option for subtitle styles.
  * Make sure it always overrides styles embedded in TTML and WebVTT files and any other styles.
  * Make sure `textStyle.edgeType: "none"` config removes any existing text shadow from the subtitles.
* Fix handling of HDR CICP EssentialProperty schemes for DASH streams.
  * Add CICP ColourPrimaries, Transfer-Characteristics, MatrixCoefficients as valid EssentialProperty.
* Fix `ReferenceError` due to unavailable `MediaEncryptedEvent` on Safari < 12.1.

# 6.4.0

## New Features

* Add track accessibility features to the public API for DASH streams (under `clpp.Track.accessibility`).
* HTTP status codes that will not trigger the retry behaviour can now be configured.
  Previously, status codes 401 and 403 were not triggering the retry behaviour. This is still
  the default, but can be changed now in the [AttemptParameters](https://demo.castlabs.com/#/docs?q=clpp.net#AttemptParameters)
  for requests types, and globally by adjusting `clpp.net.DEFAULT_FATAL_STATUS_CODES`. The
  configuration is also forwarded to [clpp.net.Request](https://demo.castlabs.com/#/docs?q=clpp.net#Request)
  and can be adjusted per request using a [RequestModifier](https://demo.castlabs.com/#/docs?q=clpp.net#RequestModifier).
* Add support for Low-Latency HLS.
  * Support for Partial Segments and Preload Hint.
  * Support for Blocking Playlist Reload.
  * Configuration by [Player configuration](https://demo.castlabs.com/#/docs/configuration) property `lowLatencyMode`, defaults to `false`.

## Changes

* Fix timeline of dynamic to static transition in DASH.
* Several improvements of tracks.
  * Fix an issue in DASH where similar `AdaptationSet` tags with distinct `Accessibility` tags where being
  processed as renditions of the same track instead of being treated as two distinct tracks.
  * Fix a corner-case issue where tracks with the same roles but in a different order were being treated as two
  separate tracks instead of a single track with two different renditions.
  * Fix issues with audio track selection when `preferredAudioRole` or `preferredAudioLanguage` is configured.
* Warn when an unsupported version of `youboralib` is supplied to the `YouboraPlugin` and emit
  a recoverable error. Supported versions are 6.8.12 - 6.8.25.
* Fix support for custom styling of subtitles.
* Fix `clpp.utils.obj.merge`.
  * Make sure it merges attributes with values that are DOM `Element`.
  * Fix documentation: `clpp.utils.obj.merge` merges from left to right, not the other way around.
* Improve `clpp.PlayerSurface`.
  * Add `clpp-video` class to the video/media element.
  * Protect PRESTOplay class attributes from modification. This prevents unexpected
    styling issues related to the re-rendering of the video or container element that can
    easily occur when used with React, Vue or similar UI frameworks.
* Improve validation of arguments passed to `clpp.Player`.
* Fix an issue where special kinds of live streams such as IPR (in-progress recording)
  were not correctly classified as live by `Player.isLive()`.
* Fix error reporting for invalid or failing thumbnails (VTT, BIF).
* Improved sync byte search for TS segment start time parsing
* Update metadata `player_name` default of Mux Analytics to `CastLabsPlayer`
* Fix time synchronization issues during sender/receiver switch for Smooth Streaming live streams on Chromecast.
* Dedicated handling for Widevine server certificate requests. We are now logging
  Widevine Server Certificate requests explicitly and set the `licenseRequestType` of
  the `request` to 'certificate-request'.
* Fixed issues with handling key restrictions in different multi period scenarios

# 6.3.0

## **Warning!**
Changes in this release might cause breaking changes for some use cases. Please double-check your current usage of the following:
* `player.getPresentationStartTime()` - For non-live content, this method now returns `null`, instead of the previous `0`.

## Changes
* Fix issues with `YouboraPlugin`.
  * Fix crash when Youbora configuration is not passed via `clpp.Player` constructor.
  * Fix an issue where Youbora plugin stopped reporting events after a call to `setYouboraPlugin`.
  * Fix an issue with the import of `youboralib` and `@castlabs/prestoplay/cl.youbora`
    when used with a bundler which performs hoisting of import statements (such as Webpack).
* Improvements on FPS License management. This release includes several improvements
  related to the FairPlay License management with the Apple Prefixed implementation
  as well as the EME implementation. Handling of multiple license requests is
  improved, and we added a few workarounds that allow us to handle rejected payloads
  better and reduce the number of failed playback attempts which previously
  caused 3016 decode errors.
* Fixed an issue where the initials FPS license request with the EME implementation
  was incorrectly reported as a renewal request.
* Changed the behavior of `player.getPresentationStartTime()`. The method now only returns numerical values when the stream is
  live and the calculation of presentation start time is possible; otherwise, it returns `null`. **Note: potentially breaking change!**
* Chromecast Cast Web Sender & Web Receiver related changes:
  * Fixed time synchronization issues for DASH live streams between cast sender and receiver. The updates address
  problems related to seeking, switching between sender/receiver, and incorrect values returned from SDK during active casting.
  * Fix `player.getDuration()` return value during live stream casting. The function now correctly returns `Infinity`,
  addressing the previous bug where `-1` was incorrectly returned. This fix applies to both receiver and sender sides
  during active casting.
  * Changed the behavior of the `clpp.cast.CastProxy.setContentMetadata()` method. This method now also accepts null, which will clear the metadata.
  * Added the `clpp.cast.CastProxy.getContentMetadata()` method.
  * In an effort to simplify the `clpp.cast.CastProxy` metadata API, we are deprecating the following methods: `setContentTitle()`, `setContentImage()`, `setContentArtist()`, `setContentReleaseDate()`, `clearContentMetadata()`. These methods will still work, but they will be removed in the next release. Please use the `setContentMetadata()` method instead. Refer to the documentation for details.

# 6.2.8

## Changes

* Fix clock sync fallback in DASH.
  * This fixes an issue where one failing `UTCTiming` tag
    cancelled the whole time sync. Now all `UTCTiming` tags are tried one-by-one until one
    succeeds, or if all fail, only then the time sync is cancelled.
  * Warn whenever a clock sync fails. Warn when no UTCTiming elements are found.
    Warn when a direct time scheme (`urn:mpeg:dash:utc:direct:2014`) provides an invalid value.
* Fix `clpp.thumbnails.ThumbnailsPlugin.get()` method, which now returns the correct
  thumbnail at a specific position for BIF thumbnails.
* Change parsing process for dynamic DASH and always perform clock
  synchronization before playback. This fixes issues related to wrong system time.
  E.g. `player.getPresentationStartTime()` is now calculated correctly, even
  when system time is wrong.
* Fix the issue where `player.play()` does not trigger a `clpp.events.AUTOPLAY_NOT_ALLOWED`
  event when Safari blocks the play request due to the 'Stop Media with Sound' auto-play policy.
* Fix `clpp.thumbnails.Thumbnail.element()` method, which now works as expected
  even if the URL of the thumbnail image contains round bracket characters.
* Fix `clpp.thumbnails.ThumbnailsPlugin.get()` method, which now returns the correct
  thumbnail at a specific position for WebVTT thumbnails.
* Fix issue with multiple (unnecessary) license requests triggered.
* Fix the license request/response modifiers for Chromecast Receiver:
  * The `licenseRequest` modifier now correctly indicates the `POST` method instead of falsely reporting `GET` for the `request` object.
  * The `licenseResponse` modifier is now properly awaited when defined as async.
  * Please refer to DRM section in manual for limitations of using request/response modifiers in Chromecast Receiver.
* Improve error logging for `MP4_SIDX_WRONG_BOX_TYPE` code. Now there is an URL, byte-range, size, and a 1kB sample of the erroneous SIDX box provided within the `clpp.Error` optional data.
* Handle FairPlay license loading with EME implementation more consistently and avoid
  redundant license requests.

# 6.2.7

## Changes

* Add `PlayerConfiguration.streaming.relativeTextTimestamp` config, which when
  set to true will force text cue times to be offset by the containing media
  segment start time.
* Add VR plugin for 360-degree video playback. See http://demo.castlabs.com/#/docs?q=clpp.vr.VrPlugin
  for more information.
* Fix appending `merchant` name to the DRMtoday Onboard Fairplay certificate URI.
* Fixed an issue with very rapid loads where the engine will not be released properly

# 6.2.6

With this version we started to publish PRESTOplay to NPM. You can now simply integrate the
player and its modules my installing it as a dependency:

```
npm install @castlabs/prestoplay
```

**Note** that we needed to make some changes to the file names and folder structure of the SDK. In
previous releases we were using `.esm.js` and `.min.js` to differentiate CJS (UMD) and ESM modules. We
needed to change the structure slightly and use `esm` and `cjs` folders now instead while keeping the
actual file names the same.

## Changes

* Introduced API for changing EME implementation to use.
  * Due to that it is now possible to use MSE with encrypted content on Apple
    devices.
  * Please refer to DRM section in a manual for more info.
* Added a `streaming.preferNativeHlsOnSafari` config option to explicitly
  specify should we play HLS content using MSE or native playback.
  * By default, this option is set to `true`.
  * Please refer to Components section in a manual for more info.
* Fix `PLAYER_ERROR_NOT_SUPPORTED_FILE` issue on Tizen for certain DASH streams.
* Fix startup issue for certain live streams on webOS 6.
* Improved `player.getSeekRange()` for native Safari playback.
* Simplified DRMtoday FairPlay certificate request structure
* Introduce the `PlayerConfiguration.forceWaitForTracks` flag to indicate that
  the load promise should only resolve once data is loaded. This allows the load
  promise to wait until data arrived and the track model is fully initialized.
  Note that, if at all, this is only required for some special cases on Safari
  native playback to make sure that tracks are resolved before load resolves.
  In the regular case the track model is already initialized when the load promise
  resolves.
* Fixed regression on default FPS license response handling. We missed
  a case where license responses should still be base64 decoded.
* Fix seekRange() values for HLS LIVE streams with MSE.
* Fixed issue with DRMtoday and FairPlay integration for multi-key cases
  where the SKD erroneously contains not only a keyId but also an
  asset id
* Added basic TTML to VTT transcoder. This allows to sideload TTML subtitles with
  native text displayer (e.g. iPhone Safari). Be aware that in this iteration we
  skip most of the styling information from TTML, so just text cues are transcoded.
* Added support for manually setting the Widevine Server Certificate in an easy way
* Added support for automatic retries in case a wrong Widevine Certificate was used


# 6.2.5
* ESM files are now compatible with ECMAScript 2015.
* Improved start up time on webOS 4+ devices.
* Broadpeak plugin has been upgraded to version 4.
  * Minimum supported version is now 4.1.1-f5f806. Version 3 does not work
    anymore with current implementation.
* Fix playback of PlayReady protected content on WebOS TVs.
* Fix disabling ABR when selected track/rendition is currently active.
* Upgrade Conviva integration to latest version (v4.5.8)
* Add Verimatrix VCAS component for easy integration with Verimatrix DRM license servers.
* Prevent timeline discontinuity playback issues on webOS 6.
* Fix DASH alternative audio tracks unavailable for encrypted content.
* Fire tracking requests for DASH events with duration equal to 0.
* Fix HLS AES-128 encryption for streams without IVs provided in the playlist.
* Add support to attach custom Youbora Plugin object to Castlabs analytics plugin.
* Chromecast - do not fail on text stream failures.

# 6.2.4
* Expose Youbora Adapter & Youbora Ads Adapter in `clpp.npaw.YouboraPlugin` via
  `getAdapter()` and `getAdsAdapter()` methods.
  * Please refer to documentation for more info.
* Fix Conviva support on Chromecast with PRESTOplay SDK for Android sender
* Added `config.preferredAudioCodec` to support manual prioritization of audio codecs
* `config.preferredVideoCodec` now accepts array of preferred codecs in priority order
* Fix `player.load()` not working on Tizen 4 & 5 after going to background and
  back to foreground.

# 6.2.3
* Add support for HLS Image Media Playlist. Refer to Thumbnails section in
  manual for more info.
* Added `abr.initialRestrictions` configuration to specify restrictions for the
  first ABR switch.
* Plugin IDs unification.
* Fix issues with setting `startTime` in Safari.
* Report initialized components to Download Portal.
* Prevent multiple `/register` calls to Download Portal.
* Added `pauseWhenInBackground` configuration. When set to `true`, the playback
  will be paused when the application is put into background and resumed once
  the application is back in foreground.
* Added `streaming.patchEdgeWhenMixedContent` field in player configuration to apply content workarounds.
* Clear text cues on seek
* Support for `SegmentTemplate.endNumber` in a DASH manifest

# 6.2.2
* iOS - fix rare bug with going to ended state on some iOS devices.
* iOS - fix false positive online events on ConnectivityChecker.
* DRM updates:
  * Introduced `clpp.drm.InitDataTransformer` modifier to provide the ability to
    directly parse and manipulate initData and construct custom payloads for
    exchange with the CDM in use. Check the DRM configuration section in manual
    for more info and examples.
  * `clpp.drm.KeySystem` enum is now extended with `NONE` and `CLEAR_KEY` values
    for more consistent and less error prone handling of DrmEnvironment's key
    system configuration.
  * Added `sessionId` field to network request. This allows a request/response
    modifier to determine which EME session made the request.
  * A set of `clpp.utils.FairplayUtils` utils are now available for handling
    common FairPlay DRM tasks.
* `clpp.utils.BufferUtils` are now available for use with array buffers.

# 6.2.1
* Added ability to specify Widevine and PlayReady robustness in the `config.drm.customData`
* Fixed subtitles not visible when the HTML text displayer not loaded in Safari
* Added `connectivityCheck` field in player configuration to check is network
  available.
  * When network availability status changes, player now emits
    `clpp.events.ONLINE_STATUS_CHANGED` event with `online` boolean property.
* Added the `config.streaming.addMissingTimelineCues` option
* TTML parser
  * Add the presentation time offset to cue timestamps
* Do not set server certificate on WebOS 3 due to a bug in WebOS'
  `MediaKeys.setServerCertificate()` implementation.

# 6.2.0
* Player Surface improvements:
  * `clpp.Player#getSurface()` method now returns `clpp.IPlayerSurface`.
  * `clpp.IPlayerSurface` interface is now exported.
  * `clpp.PlayerSurfaceCss` has been removed.
  * Following options from `clpp.PlayerSurfaceConfiguration` has been removed.
    Please check Migration Guide for more info.
    - `moveCssToContainer`
    - `containerTag`
    - `mediaTag`
    - `controls`
    - `css`
  * Added manual for Player Surface configuration.
* Subtitles improvements
  * SRT / VTT
    * The parser has been moved to an independent component, `clpp.vtt.min.js`
    * Please check `v6.2 Migration Guide` for more info.
  * TTML
    * The parser has been moved to an independent component, `clpp.ttml.min.js`
    * The parser is compatible with TTML v1 now
    * The parser converts pixel sizes to percentages in order to build responsive layouts
    * Please check `v6.2 Migration Guide` for more info.
  * The HTML text displayer
    * Following options from `clpp.PlayerConfiguration` has been removed.
      * `enableEnhancedSubtitleManager` (use `enableHtmlCue` instead)
* `clpp.utils.strings` fixes:
  * `durationToStirng()` renamed to `durationToString()`.
  * Removed `toBase64()` and `fromBase64()`. You can still use equivalent
    methods from `clpp.utils.Uint8ArrayUtils`.
* DRM updates:
  * Introduced `clpp.drm.SessionContext` object for various interactions during
    DRM session. Object is passed as a 3rd argument to license request &
    response modifiers.
  * `clpp.drm.SessionContext#ldlDelay` can be used to manually set delay between
    license requests when `license-renewal` event is not fired by CDM. This is
    primarily a case for PlayReady implementation.
* Conviva updates:
  * Do not set `osVersion` by default for LG and Hisense TVs.
  * add `deviceMetadata` field in conviva configuration to pass any needed
    metadata by user. See `clpp.ConvivaConfiguration` doc for more details.
* Dropping support for IE 11
  * Due to the consistently low level of usage,
    our PRESTOplay team has decided to discontinue IE 11 support with  6.2.0 release.
    However, maintenance support for IE 11 will still be provided
    for the next 6 months (ending 1 May 2022) through our 6.1.X versions.
    Dropping support for IE 11 will also allow our team to focus more time
    on providing the best in modern playback features and experiences.

# 6.1.13
* Do not preconfigure DRM Engine when `source.drmProtected` is set to `false`.
* Playback of direct MP4 files on Tizen
* Optimize audio track switching on Smart TV (prevent playback from freezing after track switch)


# 6.1.12
* Improve HLS with discontinuities playback when
  `#EXT-X-DISCONTINUITY-SEQUENCE` is missing.
* Add `manifest.playreadyVersion` field to force update of PlayReady header
  to specified version.
* Speed up `HtmlTextDisplayer` component on slower devices.
* Fix state reporting bug on Tizen 2.3

# 6.1.11
* Allow to configure network request parameters in DRM module by
  `clpp.DrmConfiguration.attemptParameters` configuration field.
* Use `com.microsoft.playready.recommendation` key system on Microsoft Edge:
  * Player tries to enforce hardware protection by default if DRMtoday is in use.
  * Robustness levels might be also specified in custom DRM environments.
  * Robustness levels for Playready are introduced in `clpp.drm.PlayreadyRobustnessLevel`.
* Send detailed message about license & certificate request failures to MuxData
  plugin.
* Youbora - add calculation of ad visibility.
* MuxData - fix order of ad-related events.
* Conviva + Chromecast - do not start new session on sender during casting.
* Fixed issue with video only content and codec selection
* Fixed issue with Widevine PSSH creating from newer PlayReady PSSH data
* Prefer native playback capabilities in Safari
* Fixed Conviva seek event order on Tizen platforms
* Recognize the `stpp.ttml` codec for subtitles
* Add preferred audio language support for Tizen 2.x
* Fixed issue with selected audio track not being available on Tizen 2.4

# 6.1.10
* Youbora - report DRM system in use.
* Youbora - do not start session when no intent to play.
* Conviva - add a way to set device brand and connection type. Please check
  `clpp.ConvivaConfiguration` doc for more info.
* HLS - introduced support for `#EXT-X-DISCONTINUITY` &
  `#EXT-X-DISCONTINUITY-SEQUENCE` tags.
* Fixed aborting a loading operation
* Fixed resetting a text displayer on track changed
* Add `clpp.cast.Receiver#setLoadRequestDataInterceptor()` method. Please check
  documentation for more info.
* Fixed the order of nested cues when rendering with the HtmlCue component
* Improved positioning logic in the htmlcue component.
  * The `display: inline` has been added to the `.clpp-text-cue` class
  * The `line-height` has been added to the `.clpp-text-cue` class
  * The `line-height` has been removed from the `.clpp-text-container` class
  * `position, inset, display` inline attributes have been removed from cue nodes
  * `visibility, direction` inline attributes have been added to cue wrapper nodes
* `config.preferredTextLanguage` and `config.preferredAudioLanguage` options
  accept an array of languages
* Muted the operation aborted error
* Mux Data plugin fixes:
  * More accurate Video Startup Time metrics when autoplay is on.
  * `timeupdate` events reporting.

# 6.1.9
* Introduced CDN error fallback. Check `clpp.Player.setCdnFallback()`
  documentation for more info.
* Youbora - do not create new session when seeking beyond end of content on
  Safari.
* Fix Chromecast + Conviva integration.
* Youbora - do not call `/bufferUnderrun` twice.
* Add support for IMSC1 text based & image based subtitles.
* Add support for changing player name in Conviva configuration.
* Fix Endless loop after seek on Tizen 3
* Fix wrong video height and width using AVplay on Tizen with resolution below 1080p
* Prefer text streamer for tizen native playback to mitigate issues with subtitles

# 6.1.8
* Fix going to background and foreground mode again on 2021 TV platforms.
* Fix issue with Smooth Streaming playback freezes when subtitles are enabled.
* Fix playback of DASH with PlayReady ContentProtection only on Firefox.
* Fixed removing XML tags from text cues.
* Youbora - fire `/join` request when autoplay is blocked.
* Added SMPTE-TT Embedded in ID3 for HTTP Live Streaming support
* Added support for nested SMPTE-TT tags
* clpp.tizen.TizenComponent: Normalize language code for tracks.

# 6.1.7
* Added a new config option, i.e. `config.htmlcue.enableResizeObserver`
* Added support for MPEG-DASH Callback Event
  * Introduced new `clpp.TimelineCueType.DASH_CALLBACK` timeline cue type.
* Fix issue with Fairplay multikey playback when using DRMtoday Onboard.

# 6.1.6
* Fixed an issue with seeking after DASH dynamic to static conversion.
* Fixed the initialization of the player container.
* Fixed the vertical rl mode in the html cue component
* Fix issue with subtitles selection after period transition.
* Do not play IMA ads if platform uses single video element.
* Optimize playback of Smooth Streaming content on TV platforms (webOS, Tizen).
* Fix playback of AES-128 encrypted content on webOS devices.
* Fix `HTMLTextDisplayer` component stalls on webOS 3.x devices.
* Update manual section about playback on older Tizen TV platforms.
* Added support for SMPTE-TT images (TTML)
* Added support for cue regions (WebVTT)
* Added support for embedded styles (WebVTT)

# 6.1.5
* Added the `player.setDrmCustomDataModifier` to the player interface.
  The method allows modifying DRM custom data before casting to Apple TV.
* Added `muxdata.muxOptionsOverride` config field. This allows to extend and/or
  override the config that is passed to the Mux SDK by the Mux Data plugin.
* Skip displaying subtitles if dimensions of the text container are zero.
* Enable MSE/EME (spec version 0.1b/Aug 2012) based playback on older Tizen devices (version 2.X).
* Follow redirections when playing Smooth Streaming content.
* Try to load Smooth Streaming manifest from URL with `/Manifest` suffix if
  first request with original URL resulted with HTTP error.

# 6.1.4
* Accept empty TTML segments
* Fix text track selection based on the `preferredTextLanguage` option
* Fixed cue offset when X-TIMESTAMP-MAP not defined
* Tizen Improvements:
  * Fix PlayReady protected playback on legacy Tizen devices (version 2.x)
  * Add preliminary Widevine support
  * Improved error handling and reporting
  * Add implementation for `getDrmInfo`
  * Fix native and MSE based playback on Tizen 3.0
* Fixed rare bug with incorrect seek ranges for live streams during casting.
* Add Mux Data plugin
* Support timeline cues (EventStream / SCTE-35) for Chromecast receiver.
* Chromecast - use PlayReady for Smooth Streaming playback.
* Preserve media element mute state in subsequent load requests.

# 6.1.3
* Fixed text track selection based on the `preferredTextLanguage` option
* Generate Widevine or Playready content protection elements if needed
* Added header based DRM
* Add a way to pass optional playback config when starting casting.
  * Check `clpp.cast.CastProxy#cast()` spec for more info.
* Introduced Live Edge Chasing algorithm. New configuration fields added.
  Please refer to the documentation to learn more about it.
  * `streaming.enableLiveEdgeChasing`
  * `streaming.chasingRate`
  * `streaming.startChasingAt`
  * `streaming.stopChasingAt`
  * `streaming.chaseJumpDistance`
* Chromecast metadata management.
  * Introduced `clpp.cast.CastProxy` methods to set content metadata.
  * Ability to check current metadata on receiver side by
    `clpp.cast.Receiver#getContentMetadata()` API.
  * Please refer to `clpp.cast.CastProxy` and `clpp.cast.Receiver`
    for more info.
* Conviva: Fix initial bitrate selection not reported when autoplay is disabled.
* Fixed triggering response modifiers on error

# 6.1.2
* Adobe Milestone Analytics support (BETA).
* Fixes issue with offline license loading
* Guess MP4 text codec when manifest does not specify it explicitly.
* Conviva bug fixes
* Ensure that a player release can only be triggered once until completed
  The `release()` method on the player will now always returns the same promise
  until the release is completed.
* Fixed issue with manifest retry parameters on live playback

# 6.1.1
* Fixed issue with FPS requests triggered by AppleTV devices in Airplay sessions
* Block rendition selected by ABR if it cannot be downloaded.
* Chromecast: do not disable text track when switching audio tracks on sender.
* Added support for DASH live to vod transition.
  * Added `clpp.events.MPD_TYPE_CHANGED` event to reflect this change.
* Fix PlayReady playback when PlayReady PSSH is not available.
* Add Vimond plugin
* Fix issue with AirPlay state not being consistent when starting or resuming
  an Airplay session. Please note that this seems to be a bug in Safari and
  to work around it we put the local player back into playing state. This will
  result in very short state jump into paused state and before the player goes
  back into playing state.

# 6.1.0
* Fix playback issues with HLS audio only content on MSE.
* Fix incorrect audio TS handling on Microsoft Edge
* Persistent license.
  * Introduce `clpp.persistent.fetchLicense()` API to fetch license without
    player instance. Check manual for more info.
  * Prevent sending license request twice when Persistent Component is in use.
* Smooth Streaming improvements.
  * Add support for segment timescales.
  * Fix bug with non-switchable tracks on protected content.
  * Add `manifest.liveRefreshPeriod` configuration field to manually set how
    often Smooth manifest should be updated.
* Chromecast improvements.
  * Prevent `INVALID_MEDIA_SESSION_ID` rejection when trying to play/pause/seek
    content in ended state.
  * Map `defaultBandwidthEstimate` field from `clpp.AbrConfiguration` to CAF's
    `cast.framework.PlaybackConfig.initialBandwidth`.
  * Add `onResumeLocal` callback as an `clpp.cast.CastProxy`'s optional
    parameter.
* Resolve load promise when Never Auto-Play set to true on Safari 13.1.x
* FreeWheel integration (BETA).
  * PRESTOplay SDK now comes with FreeWheel ads integration. To check it, please
    add FreeWheel SDK and our FreeWheel plugin to your project.
* Add `clpp.AbrConfiguration#useSwitchIntervalForInitialSwitch` flag to prevent
  quick ABR switch once the estimator has enough data.
* Add `clpp.Player#resetAbr()` method for resetting ABR estimate.
* Youbora integration.
  * Always fire `/pause` event to Youbora before reporting postroll.
* Expose text displayer interface.
  * Text displayer is now in BETA state with some known issues.
* Improved multi-key handling and added support for multi-key deliveries for Playready

# 6.0.4
* Added `preferredDrmSystem` option to the `clpp.DrmConfiguration` to enforce
  using specific DRM technology (i.e. force PlayReady on Edge Chromium).
* Introduces `TimelineCue` data structure and related events.
* Fixes for handling muxed audio+video TS-based content.
* Added `clpp.events.USER_SEEKING` & `clpp.events.USER_SEEKED` events
  * Those events are fired only during seeking initiated by calling
    `clpp.Player#seek()` method.
* Fix Conviva integration error.

# 6.0.3
* Support for Chromecast
  * Check manual and documentation for more info
* Support for persistent licenses
* Adds `originalId` field to the `clpp.Rendition` class
  * This field contains rendition id that appeared in original manifest

# 6.0.2
* Improves HLS + AES-128 support
  * Relative AES key URI
* Adds DRMtoday Onboard support
* Adds AirPlay support
* Bug fixes and improvements

# 6.0.1
* Adds Broadpeak's SmartLib v3-3.0.4-2950 integration (plugin).
* Introduces the crypto component (`clpp.crypto.CryptoComponent`)
  * The crypto component adds HLS + AES-128 playback capability to the player.
* Improves support of muxed audio+video TS-based contents.

# 6.0.0
PRESTOplay SDK for browsers version 6 has been re-designed from the ground up to
build a faster, more modular, and smaller player SDK. We focused on the core
components of video playback and the underlying media playback engine.

Since the new architecture was only possible with drastic measures, we needed to
adapt and change the previous API. Please, consult the migration guide from our
manual to upgrade from version 5.
