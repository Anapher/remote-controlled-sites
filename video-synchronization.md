# Video Synchronization (YouTube/mp4)
Jeder `Screen` hat einen aktuellen Content. Die einfachste Implementierung wäre, einen neuen Content-Type zu erstellen, welcher eine YouTube-Video Url oder mp4-Url beinhaltet, einen aktuellen Timestamp, und ob gerade abgespielt wird oder nicht (und ob die Url ein YouTube Video oder ein mp4 Video ist). Das ganze muss in der Datei `Screen.ts` (in dem shared Ordner in **beiden** packages) geändert werden.

```ts
export type SynchronizedVideoContent = {
   type: 'synchronized-video';
   videoType: 'mp4' | 'youtube';
   playing: boolean;
   timestamp: number;
};
```

Auf der Server Seite in `websockets/methods.ts` muss für alle Clients (nicht nur für Admins) ein neuer Handler hinzugefügt werden, welcher den aktuellen Content aktualisiert. Hier unbedingt beachten, dass das nur bei dem `synchronized-video` Content gehen darf und dieser ersetzt werden muss, wobei nur `playing` und `timestamp` geändert werden dürfen. Das Update kann dann an alle Clients gesendet werden, siehe den Handler für `REQUEST_PUT_SCREEN`.

Auf der Client Seite muss einfach nur in `src\packages\client\src\features\screen\components\ScreenConnectedView.tsx` ein Handler für den neuen Content-Type hinzugefügt werden, welcher dann entsprechend das Video richtig rendert.

## RedParty ist eine simple Implementierung, an der sich stark orientiert werden kann

In der Datei [`Player.js`](https://github.com/ahmedsadman/redparty/blob/cf6282f8b854033feec4663bbc164343dbaed4be/client/src/components/Room/Player.js) wird simpel gezeigt, wie ein YouTube-Player gesteuert werden und Events gesendet werden können.

In der Datei [`socket.js`](https://github.com/ahmedsadman/redparty/blob/cf6282f8b854033feec4663bbc164343dbaed4be/client/src/utils/socket.js) wird wiederrum gezeigt, wie die Message-Implementierung funktionieren kann. Das ganze kann aber stark abgekürzt werden, indem einfach in dem aktuellen Content alle wichtigen Informationen festgehalten werden, und dieser zwischen allen Clients synchronisiert wird.


## Referenzen
https://www.reddit.com/r/reactjs/comments/j4mngn/redparty_host_youtube_watch_party_with_friends/
https://github.com/ahmedsadman/redparty
https://www.reddit.com/r/reactjs/comments/hsh9bg/stream_party_watch_and_search_youtube_videos_in/