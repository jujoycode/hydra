# [Hydra] DB Naming Convention

## 1. Common
- 스네이크 표기법(Snake case)를 사용해야 합니다.
- 문자로 시작하되, 언더스코어(_)로 끝나지 않아야 합니다.
- 대문자료 표기합니다.
- 공백이 들어갈 경우 공백 대신 언더스코어(_)를 사용해야 합니다.
- 약어는 일반적으로 통용되는 명칭을 사용해야 합니다.

## 2. Table
- 접두사를 사용하지 않습니다.
- 두 개 이상의 테이블명을 이어서 짓지 않아야 합니다. (Ex. USER, ISSUE -> USER_ISSUE)

## 3. Column
- 단수로 표시해야 합니다.
- Prefix/Infix/Suffix는 각각 4글자를 초과하지 않아야 합니다.
- 테이블명을 컬럼명으로 사용하지 않아야 합니다.

## 4. Frequency Prefix & Suffix
| Prefix | Suffix | Description |
|:------:|:------:|:-----------:|
| FK_ | - | 외래 키 |
| - | _DATE | 일시를 포함할 경우 |
| - | _TIME | 시간만 포함할 경우 |
| - | _STAT | 상태를 표시할 경우 |
| - | _NAME | 이름을 표시할 경우 |
| - | _DESC | 이름을 표시할 경우 |

## 5. Reserved Words
- SQL 예약어는 테이블/컬럼명으로 사용하지 않습니다.
- 예시: ORDER, GROUP, WHERE 등

## 6. Reference
- [Abbreviations](https://www.abbreviations.com/abbreviation/Status)