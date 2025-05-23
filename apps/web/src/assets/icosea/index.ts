export type ICOSEA_ICON_KEYS = "link"  | "thumbnail"  | "open-file"  | "open-link"  | "copy_file" ;

const icosea_icon_obj : Record<ICOSEA_ICON_KEYS,(w:string | number, h:string | number,c:string, cls:string) => string> = { 
"link": (w, h, c,cls) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 16 16" class="icosea_icon ${cls} "><path fill="${c}" fill-rule="evenodd" d="M3.47 6.53a.75.75 0 0 1 1.06 1.061l-.727.727a2.743 2.743 0 0 0 3.879 3.879l.727-.727a.75.75 0 0 1 1.06 1.06l-.726.727a4.243 4.243 0 0 1-6-6zm8 1.879a.75.75 0 0 0 1.06 1.06l.727-.726a4.243 4.243 0 0 0-6-6l-.727.727a.75.75 0 0 0 1.061 1.06l.727-.727a2.743 2.743 0 0 1 3.879 3.879zm-.94-1.879a.75.75 0 1 0-1.06-1.06l-4 4a.75.75 0 1 0 1.06 1.06z" clip-rule="evenodd"></path></svg>`,
"thumbnail": (w, h, c,cls) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" class="icosea_icon ${cls} "><path fill="${c}" d="M4.116 18q-.667 0-1.141-.475t-.475-1.14v-8.77q0-.666.475-1.14T4.115 6h8.77q.666 0 1.14.475t.475 1.14v8.77q0 .666-.475 1.14t-1.14.475zm13.201-7q-.357 0-.587-.23t-.23-.587V6.817q0-.357.23-.587t.587-.23h3.366q.357 0 .587.23t.23.587v3.366q0 .358-.23.587t-.587.23zm.183-1h3V7h-3zM4.116 17h8.769q.269 0 .442-.173t.173-.442v-8.77q0-.269-.173-.442T12.885 7h-8.77q-.269 0-.442.173t-.173.443v8.769q0 .269.173.442t.443.173m.576-2.096h7.616l-2.433-3.25L8 14.154l-1.375-1.825zM17.317 18q-.357 0-.587-.23t-.23-.587v-3.366q0-.357.23-.587t.587-.23h3.366q.357 0 .587.23t.23.587v3.366q0 .358-.23.587t-.587.23zm.183-1h3v-3h-3zm-14 0V7zm14-7V7zm0 7v-3z"></path></svg>`,
"open-file": (w, h, c,cls) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 512 512" class="icosea_icon ${cls} "><g fill="${c}" fill-rule="evenodd"><path d="m220.75 85.334l53.889 42.61l-64.003 64.016h-93.985L44.004 426.667h-1.337V85.334zM148.114 234.62l330.757.005l-58.287 192.041H88.667z"></path><path fill-rule="nonzero" d="M426.667 42.667V192H384v-76.497L307.503 192h-60.34L353.83 85.333h-76.496V42.668z"></path></g></svg>`,
"open-link": (w, h, c,cls) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 12 12" class="icosea_icon ${cls} "><path fill="${c}" d="M4 3.5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-.25a.75.75 0 0 1 1.5 0V8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h.25a.75.75 0 0 1 0 1.5zm2.75 0a.75.75 0 0 1 0-1.5h2.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-.69L7.28 5.78a.75.75 0 0 1-1.06-1.06L7.44 3.5z"></path></svg>`,
"copy_file": (w, h, c,cls) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24" class="icosea_icon ${cls} "><path fill="${c}" d="M16 20H8a3 3 0 0 1-3-3V7a1 1 0 0 0-2 0v10a5 5 0 0 0 5 5h8a1 1 0 0 0 0-2m-6-7a1 1 0 0 0 1 1h5a1 1 0 0 0 0-2h-5a1 1 0 0 0-1 1m11-4.06a1.3 1.3 0 0 0-.06-.27v-.09a1 1 0 0 0-.19-.28l-6-6a1 1 0 0 0-.28-.19a.3.3 0 0 0-.09 0a.9.9 0 0 0-.33-.11H10a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3zm-6-3.53L17.59 8H16a1 1 0 0 1-1-1ZM19 15a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3v3a3 3 0 0 0 .18 1H11a1 1 0 0 0 0 2h8Z"></path></svg>`,

} 

type iconOptions = {
  /**width of icon. it will be place to width="<your value>" */
  w?: string | number;
  /**height of icon. it will be place to height="<your value>" */
  h?: string | number;
  /**Specified className. You can target this specific icon. or any tailwind class */
  cls?: string;
  /**Color of icon. */
  c?: string;
};
export default function icon(name:ICOSEA_ICON_KEYS, obj?: iconOptions): string {
  const {w,h,c,cls} =  { c: "currentColor",h:"1em",w:"1em",cls:"", ...(obj??{})};
  return  icosea_icon_obj[name](w, h, c, cls);
}
