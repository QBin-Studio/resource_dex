
export type ICOSEA_ICON_KEYS = "link"  | "thumbnail" ;

const icosea_icon_obj : Record<ICOSEA_ICON_KEYS,(w:string | number, h:string | number,c:string, cls:string) => string> = { 
"link": (w, h, c,cls) => `<svg class="icosea_icon ${cls}" xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 16 16"><path fill="${c}" fill-rule="evenodd" d="M3.47 6.53a.75.75 0 0 1 1.06 1.061l-.727.727a2.743 2.743 0 0 0 3.879 3.879l.727-.727a.75.75 0 0 1 1.06 1.06l-.726.727a4.243 4.243 0 0 1-6-6zm8 1.879a.75.75 0 0 0 1.06 1.06l.727-.726a4.243 4.243 0 0 0-6-6l-.727.727a.75.75 0 0 0 1.061 1.06l.727-.727a2.743 2.743 0 0 1 3.879 3.879zm-.94-1.879a.75.75 0 1 0-1.06-1.06l-4 4a.75.75 0 1 0 1.06 1.06z" clip-rule="evenodd"/></svg>`,
"thumbnail": (w, h, c,cls) => `<svg class="icosea_icon ${cls}" xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24"><path fill="${c}" d="M4.116 18q-.667 0-1.141-.475t-.475-1.14v-8.77q0-.666.475-1.14T4.115 6h8.77q.666 0 1.14.475t.475 1.14v8.77q0 .666-.475 1.14t-1.14.475zm13.201-7q-.357 0-.587-.23t-.23-.587V6.817q0-.357.23-.587t.587-.23h3.366q.357 0 .587.23t.23.587v3.366q0 .358-.23.587t-.587.23zm.183-1h3V7h-3zM4.116 17h8.769q.269 0 .442-.173t.173-.442v-8.77q0-.269-.173-.442T12.885 7h-8.77q-.269 0-.442.173t-.173.443v8.769q0 .269.173.442t.443.173m.576-2.096h7.616l-2.433-3.25L8 14.154l-1.375-1.825zM17.317 18q-.357 0-.587-.23t-.23-.587v-3.366q0-.357.23-.587t.587-.23h3.366q.357 0 .587.23t.23.587v3.366q0 .358-.23.587t-.587.23zm.183-1h3v-3h-3zm-14 0V7zm14-7V7zm0 7v-3z"/></svg>`,

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

