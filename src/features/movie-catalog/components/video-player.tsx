"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import Forward10RoundedIcon from "@mui/icons-material/Forward10Rounded";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import KeyboardVoiceRoundedIcon from "@mui/icons-material/KeyboardVoiceRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import PictureInPictureAltRoundedIcon from "@mui/icons-material/PictureInPictureAltRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import Replay10RoundedIcon from "@mui/icons-material/Replay10Rounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import TvRoundedIcon from "@mui/icons-material/TvRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useEffect, useMemo, useRef, useState } from "react";

import Hls from "hls.js";

import type {
  MovieEpisodeServerDto,
  MovieEpisodeSourceDto,
  RemoteMovieDto,
} from "@/server/modules/movies/dto/movie.dto";

import {
  getFirstPlayableEpisodeFromServer,
  getFirstServerWithItems,
  isEpisodePlayable,
} from "../lib/movie-catalog-format";

interface VideoPlayerProps {
  initialEpisodeSlug?: string;
  initialServerSlug?: string;
  movie: RemoteMovieDto;
  servers: MovieEpisodeServerDto[];
}

interface PlaybackSelection {
  episode: MovieEpisodeSourceDto | null;
  notice: string;
  server: MovieEpisodeServerDto | null;
}

interface WatchEpisodeChangeDetail {
  episodeSlug: string;
  serverSlug: string;
}

function findServerBySlug(servers: MovieEpisodeServerDto[], serverSlug?: string) {
  if (!serverSlug) {
    return null;
  }

  return servers.find((server) => server.server_slug === serverSlug) || null;
}

function findEpisodeBySlug(server: MovieEpisodeServerDto | null, episodeSlug?: string) {
  if (!server || !episodeSlug) {
    return null;
  }

  return server.items.find((item) => item.slug === episodeSlug) || null;
}

function findGlobalPlayableSelection(servers: MovieEpisodeServerDto[]) {
  for (const server of servers) {
    const episode = getFirstPlayableEpisodeFromServer(server);

    if (episode) {
      return { episode, server };
    }
  }

  return null;
}

function resolvePlaybackSelection(
  servers: MovieEpisodeServerDto[],
  preferredServerSlug?: string,
  preferredEpisodeSlug?: string,
): PlaybackSelection {
  const preferredServer = findServerBySlug(servers, preferredServerSlug);
  const preferredEpisode = findEpisodeBySlug(preferredServer, preferredEpisodeSlug);

  if (preferredEpisode && isEpisodePlayable(preferredEpisode)) {
    return {
      episode: preferredEpisode,
      notice: "",
      server: preferredServer,
    };
  }

  if (preferredEpisode && !isEpisodePlayable(preferredEpisode)) {
    if (preferredServer) {
      return {
        episode: preferredEpisode,
        notice: "Tập này chưa có nguồn phát. Bạn có thể chọn tập khác ở danh sách bên dưới.",
        server: preferredServer,
      };
    }
  }

  if (preferredServer) {
    const serverFallback = getFirstPlayableEpisodeFromServer(preferredServer);

    if (serverFallback) {
      return {
        episode: serverFallback,
        notice: "",
        server: preferredServer,
      };
    }
  }

  const globalFallback = findGlobalPlayableSelection(servers);

  if (globalFallback) {
    return {
      episode: globalFallback.episode,
      notice: "",
      server: globalFallback.server,
    };
  }

  const firstServer = getFirstServerWithItems(servers);

  return {
    episode: firstServer?.items[0] || null,
    notice: "",
    server: firstServer,
  };
}

function findNextPlayableEpisode(
  servers: MovieEpisodeServerDto[],
  activeServerId: string,
  activeEpisodeSlug: string,
) {
  const activeServerIndex = servers.findIndex((server) => server.id === activeServerId);

  if (activeServerIndex === -1) {
    return null;
  }

  for (let serverIndex = activeServerIndex; serverIndex < servers.length; serverIndex += 1) {
    const server = servers[serverIndex];
    const startIndex =
      server.id === activeServerId
        ? server.items.findIndex((item) => item.slug === activeEpisodeSlug) + 1
        : 0;

    for (let episodeIndex = Math.max(0, startIndex); episodeIndex < server.items.length; episodeIndex += 1) {
      const episode = server.items[episodeIndex];

      if (isEpisodePlayable(episode)) {
        return {
          episodeSlug: episode.slug,
          serverId: server.id,
        };
      }
    }
  }

  return null;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const wholeSeconds = Math.floor(seconds);
  const hours = Math.floor(wholeSeconds / 3600);
  const minutes = Math.floor((wholeSeconds % 3600) / 60);
  const secs = wholeSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function VideoPlayer({
  initialEpisodeSlug,
  initialServerSlug,
  movie,
  servers,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const initialSelection = useMemo(
    () => resolvePlaybackSelection(servers, initialServerSlug, initialEpisodeSlug),
    [initialEpisodeSlug, initialServerSlug, servers],
  );

  const [activeServerId, setActiveServerId] = useState(initialSelection.server?.id || "");
  const [activeEpisodeSlug, setActiveEpisodeSlug] = useState(
    initialSelection.episode?.slug || "",
  );
  const [playerNotice, setPlayerNotice] = useState(initialSelection.notice);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [autoNext, setAutoNext] = useState(true);
  const [skipIntro, setSkipIntro] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const activeServer =
    servers.find((server) => server.id === activeServerId) ||
    initialSelection.server ||
    null;

  const activeEpisode =
    activeServer?.items.find((item) => item.slug === activeEpisodeSlug) ||
    null;

  useEffect(() => {
    const nextSelection = resolvePlaybackSelection(
      servers,
      initialServerSlug,
      initialEpisodeSlug,
    );

    setActiveServerId(nextSelection.server?.id || "");
    setActiveEpisodeSlug(nextSelection.episode?.slug || "");
    setPlayerNotice(nextSelection.notice);
  }, [initialEpisodeSlug, initialServerSlug, servers]);

  useEffect(() => {
    if (!activeServer) {
      return;
    }

    const selectedEpisode = activeServer.items.find(
      (item) => item.slug === activeEpisodeSlug,
    );

    if (selectedEpisode) {
      if (!isEpisodePlayable(selectedEpisode)) {
        setPlayerNotice("Tập này chưa có nguồn phát. Bạn có thể chọn tập khác ở danh sách bên dưới.");
      }

      return;
    }

    const fallbackEpisode = getFirstPlayableEpisodeFromServer(activeServer);

    if (fallbackEpisode) {
      setActiveEpisodeSlug(fallbackEpisode.slug);

      return;
    }

    const globalFallback = findGlobalPlayableSelection(servers);

    if (globalFallback) {
      setActiveServerId(globalFallback.server.id);
      setActiveEpisodeSlug(globalFallback.episode.slug);

    }
  }, [activeEpisodeSlug, activeServer, servers]);

  useEffect(() => {
    const handleEpisodeChange = (event: Event) => {
      const detail = (event as CustomEvent<WatchEpisodeChangeDetail>).detail;
      const nextServer = servers.find((server) => server.server_slug === detail.serverSlug);
      const nextEpisode = nextServer?.items.find((item) => item.slug === detail.episodeSlug);

      if (!nextServer || !nextEpisode) {
        return;
      }

      setActiveServerId(nextServer.id);
      setActiveEpisodeSlug(nextEpisode.slug);
      setPlayerNotice(
        isEpisodePlayable(nextEpisode)
          ? ""
          : "Tập này chưa có nguồn phát. Bạn có thể chọn tập khác ở danh sách bên dưới.",
      );
    };

    window.addEventListener("watch-episode-change", handleEpisodeChange);

    return () => {
      window.removeEventListener("watch-episode-change", handleEpisodeChange);
    };
  }, [servers]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !activeEpisode?.m3u8) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = activeEpisode.m3u8;
      return;
    }

    if (!Hls.isSupported()) {
      video.src = activeEpisode.m3u8;
      return;
    }

    const hls = new Hls({
      enableWorker: true,
    });

    hls.loadSource(activeEpisode.m3u8);
    hls.attachMedia(video);

    return () => {
      hls.destroy();
    };
  }, [activeEpisode?.m3u8]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.volume = volume;
    video.muted = isMuted || volume === 0;
  }, [isMuted, volume]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const syncState = () => {
      setCurrentTime(video.currentTime || 0);
      setDuration(video.duration || 0);
      setIsPlaying(!video.paused);
      setIsMuted(video.muted);
      setVolume(video.volume);
    };

    const handleEnded = () => {
      setIsPlaying(false);

      if (!autoNext) {
        return;
      }

      const nextEpisode = findNextPlayableEpisode(
        servers,
        activeServerId,
        activeEpisodeSlug,
      );

      if (!nextEpisode) {
        return;
      }

      setActiveServerId(nextEpisode.serverId);
      setActiveEpisodeSlug(nextEpisode.episodeSlug);
      setPlayerNotice("");
    };

    syncState();

    video.addEventListener("loadedmetadata", syncState);
    video.addEventListener("timeupdate", syncState);
    video.addEventListener("durationchange", syncState);
    video.addEventListener("play", syncState);
    video.addEventListener("pause", syncState);
    video.addEventListener("volumechange", syncState);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadedmetadata", syncState);
      video.removeEventListener("timeupdate", syncState);
      video.removeEventListener("durationchange", syncState);
      video.removeEventListener("play", syncState);
      video.removeEventListener("pause", syncState);
      video.removeEventListener("volumechange", syncState);
      video.removeEventListener("ended", handleEnded);
    };
  }, [activeEpisodeSlug, activeServerId, autoNext, servers]);

  const copyShareLink = async () => {
    if (typeof window === "undefined") {
      return;
    }

    const shareUrl = `${window.location.origin}/xem-phim/${movie.slug}?server=${activeServer?.server_slug ?? ""}&episode=${activeEpisode?.slug ?? ""}`;
    await navigator.clipboard.writeText(shareUrl);
  };

  const updateVolume = (nextVolume: number) => {
    const normalizedVolume = Math.min(1, Math.max(0, nextVolume));
    const video = videoRef.current;

    setVolume(normalizedVolume);
    setIsMuted(normalizedVolume === 0);

    if (!video) {
      return;
    }

    video.volume = normalizedVolume;
    video.muted = normalizedVolume === 0;
  };

  const progressValue = useMemo(() => {
    if (!duration) {
      return 0;
    }

    return Math.min((currentTime / duration) * 100, 100);
  }, [currentTime, duration]);

  if (!activeServer || !activeEpisode) {
    return (
      <div className="movie-player-empty">
        <h3>Nguồn phát đang được cập nhật</h3>
        <p>Phim này chưa có tập phát khả dụng trong dữ liệu crawl hiện tại.</p>
      </div>
    );
  }

  return (
    <div className={`movie-player ${theaterMode ? "is-theater-mode" : ""}`}>
      {playerNotice ? (
        <div className="movie-player__alert">
          <WarningAmberRoundedIcon sx={{ fontSize: 18 }} />
          <span>{playerNotice}</span>
        </div>
      ) : null}

      <div className="movie-player__stage">
        {activeEpisode.m3u8 ? (
          <>
            <video
              id="movie-player-video"
              playsInline
              poster={movie.poster || movie.thumbnail}
              ref={videoRef}
            />

            <div className="movie-player__controls">
              <div className="movie-player__controls-row">
                <div className="movie-player__controls-group">
                  <button
                    aria-label={isPlaying ? "T岷 d峄玭g" : "Ph谩t"}
                    onClick={() => {
                      const video = videoRef.current;

                      if (!video) {
                        return;
                      }

                      if (video.paused) {
                        void video.play();
                        return;
                      }

                      video.pause();
                    }}
                    type="button"
                  >
                    {isPlaying ? (
                      <PauseRoundedIcon sx={{ fontSize: 24 }} />
                    ) : (
                      <PlayArrowRoundedIcon sx={{ fontSize: 24 }} />
                    )}
                  </button>

                  <button
                    aria-label="L霉i 10 gi芒y"
                    onClick={() => {
                      const video = videoRef.current;

                      if (!video) {
                        return;
                      }

                      video.currentTime = Math.max(0, video.currentTime - 10);
                    }}
                    type="button"
                  >
                    <Replay10RoundedIcon sx={{ fontSize: 22 }} />
                  </button>

                  <button
                    aria-label="T峄沬 10 gi芒y"
                    onClick={() => {
                      const video = videoRef.current;

                      if (!video) {
                        return;
                      }

                      video.currentTime = Math.min(
                        video.duration || 0,
                        video.currentTime + 10,
                      );
                    }}
                    type="button"
                  >
                    <Forward10RoundedIcon sx={{ fontSize: 22 }} />
                  </button>

                  <div className="movie-player__volume">
                    <button
                      aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                      onClick={() => {
                        const video = videoRef.current;
                        const nextMuted = !isMuted;

                        setIsMuted(nextMuted);

                        if (video) {
                          video.muted = nextMuted;
                        }
                      }}
                      type="button"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeOffRoundedIcon sx={{ fontSize: 22 }} />
                      ) : (
                        <VolumeUpRoundedIcon sx={{ fontSize: 22 }} />
                      )}
                    </button>

                    <input
                      aria-label="脗m l瓢峄g"
                      max="1"
                      min="0"
                      onChange={(event) => {
                        updateVolume(Number(event.target.value));
                      }}
                      onInput={(event) => {
                        updateVolume(Number(event.currentTarget.value));
                      }}
                      step="0.01"
                      type="range"
                      value={isMuted ? 0 : volume}
                    />
                  </div>

                  <div className="movie-player__time">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                <div className="movie-player__controls-group movie-player__controls-group--right">
                  <button aria-label="Micro" type="button">
                    <KeyboardVoiceRoundedIcon sx={{ fontSize: 22 }} />
                  </button>

                  <button
                    aria-label="Tập tiếp theo"
                    onClick={() => {
                      const nextEpisode = findNextPlayableEpisode(
                        servers,
                        activeServerId,
                        activeEpisodeSlug,
                      );

                      if (!nextEpisode) {
                        return;
                      }

                      setActiveServerId(nextEpisode.serverId);
                      setActiveEpisodeSlug(nextEpisode.episodeSlug);
                      setPlayerNotice("");
                    }}
                    type="button"
                  >
                    <SkipNextRoundedIcon sx={{ fontSize: 22 }} />
                  </button>

                  <button
                    aria-label="Ch岷?膽峄?h矛nh trong h矛nh"
                    onClick={async () => {
                      const video = videoRef.current;

                      if (!video || !document.pictureInPictureEnabled) {
                        return;
                      }

                      if (document.pictureInPictureElement) {
                        await document.exitPictureInPicture();
                        return;
                      }

                      await video.requestPictureInPicture();
                    }}
                    type="button"
                  >
                    <PictureInPictureAltRoundedIcon sx={{ fontSize: 22 }} />
                  </button>

                  <button
                    aria-label="Tự động chuyển tập"
                    className={autoNext ? "is-active" : ""}
                    onClick={() => setAutoNext((value) => !value)}
                    type="button"
                  >
                    <span className="movie-player__auto-badge">Tập</span>
                  </button>

                  <button
                    aria-label="To脿n m脿n h矛nh"
                    onClick={() => {
                      const video = videoRef.current;
                      void video?.requestFullscreen?.();
                    }}
                    type="button"
                  >
                    <FullscreenRoundedIcon sx={{ fontSize: 22 }} />
                  </button>
                </div>
              </div>

              <div className="movie-player__progress">
                <input
                  aria-label="Ti岷縩 膽峄?video"
                  max={duration || 0}
                  min="0"
                  onChange={(event) => {
                    const video = videoRef.current;
                    const nextTime = Number(event.target.value);

                    setCurrentTime(nextTime);

                    if (!video) {
                      return;
                    }

                    video.currentTime = nextTime;
                  }}
                  step="0.1"
                  type="range"
                  value={currentTime}
                />
                <span
                  className="movie-player__progress-fill"
                  style={{ width: `${progressValue}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="movie-player-empty">
            <h3>T岷璸 n脿y ch瓢a c贸 ngu峄搉 xem tr峄眂 ti岷縫</h3>
            <p>
              T岷璸 n脿y v岷玭 ch瓢a ph谩t s贸ng ho岷穋 ch瓢a c贸 `m3u8`.
              H茫y ch峄峮 m峄檛 t岷璸 kh谩c 膽茫 ph谩t 峄?b锚n d瓢峄沬.
            </p>
          </div>
        )}
      </div>

      <div className="movie-player__action-strip">
        <button
          className={isFavorite ? "is-active" : ""}
          onClick={() => setIsFavorite((value) => !value)}
          type="button"
        >
          <FavoriteBorderRoundedIcon sx={{ fontSize: 18 }} />
          <span>Yêu Thích</span>
        </button>

        <button
          className={isSaved ? "is-active" : ""}
          onClick={() => setIsSaved((value) => !value)}
          type="button"
        >
          <AddRoundedIcon sx={{ fontSize: 18 }} />
          <span>Thêm vào</span>
        </button>

        <button
          className={autoNext ? "is-active" : ""}
          onClick={() => setAutoNext((value) => !value)}
          type="button"
        >
          <SkipNextRoundedIcon sx={{ fontSize: 18 }} />
          <span>Chuyển tiếp</span>
          <strong>{autoNext ? "Bật" : "Tắt"}</strong>
        </button>

        <button
          className={skipIntro ? "is-active" : ""}
          onClick={() => setSkipIntro((value) => !value)}
          type="button"
        >
          <AutoAwesomeRoundedIcon sx={{ fontSize: 18 }} />
          <span>Bỏ qua giới thiệu</span>
          <strong>{skipIntro ? "Bật" : "Tắt"}</strong>
        </button>

        <button
          className={theaterMode ? "is-active" : ""}
          onClick={() => setTheaterMode((value) => !value)}
          type="button"
        >
          <TvRoundedIcon sx={{ fontSize: 18 }} />
          <span>Rạp phim</span>
          <strong>{theaterMode ? "Bật" : "Tắt"}</strong>
        </button>

        <button onClick={() => void copyShareLink()} type="button">
          <ShareRoundedIcon sx={{ fontSize: 18 }} />
          <span>Chia sẻ</span>
        </button>

        <a href="/xem-chung">
          <GroupsRoundedIcon sx={{ fontSize: 18 }} />
          <span>Xem chung</span>
        </a>

        <button type="button">
          <ErrorOutlineRoundedIcon sx={{ fontSize: 18 }} />
          <span>Báo lỗi</span>
        </button>
      </div>
    </div>
  );
}
