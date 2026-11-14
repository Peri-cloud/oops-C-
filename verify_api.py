#!/usr/bin/env python3
"""End-to-end verification: submit every reference solution through the real API
(the same route the browser uses) and require compile OK + all test cases passed.
Also submits every buggy debugging starter and requires it to FAIL at least one case."""
import json, urllib.request, sys

BASE = 'http://localhost:3000/api/run'
DATA = '/home/z/my-project/src/data/exam-data.json'

def post(payload):
    req = urllib.request.Request(BASE, data=json.dumps(payload).encode(),
                                 headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read().decode())

data = json.load(open(DATA))
fails = []
ok_count = 0
bug_ok = 0

print('--- reference solutions (must pass ALL cases) ---')
for q in data['questions']:
    r = post({'questionId': q['id'], 'mode': 'submit', 'code': q['referenceSolution']})
    total = len(q['tests'])
    status = 'OK' if (r.get('compile') == 'OK' and r.get('passed') == total) else 'FAIL'
    if status == 'OK':
        ok_count += 1
        print(f"  {q['id']:<7} {r['passed']}/{total} {status}")
    else:
        fails.append(f"{q['id']}: compile={r.get('compile')} passed={r.get('passed')}/{total}")
        print(f"  {q['id']:<7} {r.get('passed')}/{total} {status} compile={r.get('compile')}")

print('--- buggy debugging starters (must FAIL at least one case) ---')
for q in data['questions']:
    if q['kind'] != 'Debugging':
        continue
    r = post({'questionId': q['id'], 'mode': 'submit', 'code': q['starterCode']})
    passed, total = r.get('passed', 0), len(q['tests'])
    if r.get('compile') == 'OK' and passed < total:
        bug_ok += 1
        print(f"  {q['id']:<7} {passed}/{total} correctly broken")
    else:
        fails.append(f"{q['id']} BUGGY starter unexpectedly passes {passed}/{total} (compile={r.get('compile')})")
        print(f"  {q['id']:<7} {passed}/{total} PROBLEM: not failing!")

print(f"\nSummary: {ok_count}/45 reference solutions pass ALL cases; {bug_ok}/25 buggy starters correctly fail.")
if fails:
    print('FAILURES:')
    for f in fails:
        print(' -', f)
sys.exit(1 if fails else 0)
