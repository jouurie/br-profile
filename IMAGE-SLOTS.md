# 새 그림 자리 (브렌든)

세계관 화면의 왼쪽 폴라로이드는 지금까지 탭을 바꿔도 늘 「파도풀」 사진이었습니다.
탭마다 다른 사진이 나오도록 자리를 두 칸 만들었고, 그림이 들어오기 전까지는 사진 칸에 설명 글이 적혀 있습니다.

그림 파일을 `assets/` 에 넣고 `content.js` 맨 아래 `imageSlots` 의 `src` 만 채우면 사진으로 바뀝니다.

## 공통 화풍 (모든 프롬프트 앞에 붙이기)

> Clean anime background illustration, crisp line art with flat cel shading, saturated cobalt blue and cyan palette with small yellow accents, closed 1990s Canadian indoor waterpark at night, dreamcore liminal mood, empty of people. Same art style as the existing wave pool photo. No text, no watermark, no logo.

- 크기: 1536×1024 (가로 3:2, 기존 `waterpark.png` 와 같음)
- 사람은 넣지 않습니다. 브렌든은 초상 사진에만 나옵니다.

| 칸(`imageSlots` 키) | 나오는 곳 | 파일 이름(권장) | 화면에 적힌 설명 | 프롬프트 |
|---|---|---|---|---|
| `worldDream` | 세계관 › 꿈 회차 | `assets/world-locker.webp` | 불 꺼진 락커룸. 줄지은 파란 사물함 가운데 문 하나만 열려 있고, 젖은 타일에 수영장 물빛이 일렁인다. | Dark locker room of an indoor waterpark, long rows of blue metal lockers, a single locker door hanging open, wet tiled floor reflecting rippling pool light from a doorway at the far end, one flickering fluorescent tube. |
| `worldWake` | 세계관 › 깨어나는 시간 | `assets/world-exit.webp` | 직원 복도 끝, 초록 출구 표시등. 닫힌 문틈으로 현실의 아침빛이 가늘게 새어 든다. | Narrow staff corridor with painted cinder-block walls and exposed pipes, a glowing green EXIT sign shape above a closed door at the end (no readable letters), thin warm morning light leaking around the door frame against the cold blue interior. |

## 참고: 그림 무게

`assets/` 의 PNG 가 장당 1.6–2.3MB 입니다(`brendan.png`, `waterpark.png`, `paper-texture.png` 등).
새 그림은 WebP 로 넣는 것을 권합니다. 기존 PNG 도 WebP 로 바꾸면 첫 화면이 눈에 띄게 빨라집니다.
