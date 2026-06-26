const TOP_SLIDER_MARKER = '<div id="top_slider">';
const COMMUNITY_MARKER = '<div class="effect-fade-in" id="community">';

export interface CobePhimMainSegments {
  community: string;
  prefix: string;
}

export function splitCobePhimMainHtml(html: string): CobePhimMainSegments | null {
  const topSliderIndex = html.indexOf(TOP_SLIDER_MARKER);
  const communityIndex = html.indexOf(COMMUNITY_MARKER);

  if (topSliderIndex === -1 || communityIndex === -1 || communityIndex <= topSliderIndex) {
    return null;
  }

  return {
    community: html.slice(communityIndex),
    prefix: html.slice(0, topSliderIndex),
  };
}
