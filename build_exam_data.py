#!/usr/bin/env python3
"""Build exam-data.json for the IAMNEO practice app.

Sources (all produced and verified in the earlier QB-merge project):
  - scripts/build_docx/u{1..5}_meta.json : 45 question statements (4 Coding + 5 Debugging per unit)
  - scripts/solutions/U*_C*.cpp U*_D*.cpp: verified reference solutions (ALL PASS in test_results.json)
  - scripts/solutions/tests_u{1..5}.json : verified test cases (input, expected, tag)
  - scripts/build_docx/mcq_u{1..5}.json  : 100 MCQs with answers + explanations
  - scripts/solutions/mcq_code/U*_Q*.cpp : code for the verified code-output MCQs
  - scripts/solutions/mcq_results.json   : compiled-and-run verification of code MCQs

This script:
  1. Parses statements into sections (problem / input / output / constraints).
  2. Creates starter code: skeleton for Coding, PLANTED-BUG code for Debugging
     (each planted bug is verified: compiles OK and fails at least one sample test).
  3. Re-verifies every reference solution against every test case.
  4. Adds extra hidden test cases for U4/U5 questions (outputs computed by the
     verified reference solutions).
  5. Emits src/data/exam-data.json + a verification report.
"""
import json, os, re, subprocess, tempfile, shutil, sys

BASE = '/home/z/my-project'
SOL = f'{BASE}/scripts/solutions'
META = f'{BASE}/scripts/build_docx'
OUT = f'{BASE}/src/data/exam-data.json'

SAMPLE_TAGS = {'sample', 'sample-image'}
HIDDEN_TAGS = {'answerkey', 'hidden', 'reconstructed', 'inferred_output', 'extra'}

SKELETON = '''#include <iostream>
using namespace std;

int main() {
    // Write your code here

    return 0;
}
'''

# ---------------- planted bugs: qid -> (find, replace, label) ----------------
BUGS = {
 'U1_D1': ('cout << fixed << setprecision(2);\n    cout << "Default Box Volume: "',
           'cout << "Default Box Volume: "',
           'Output is printed without fixed << setprecision(2), so volumes show the wrong number of decimals.'),
 'U1_D2': ('title = other.title + "_copy";\n        pages = other.pages;',
           'title = other.title + "_copy";\n        pages = 0;',
           'The copy constructor forgets to copy the page count, so the copy shows the wrong number of pages.'),
 'U1_D3': ('if (amount <= balance) {', 'if (amount < balance) {',
           'withdraw compares with < instead of <=, so withdrawing exactly the whole balance is wrongly rejected.'),
 'U1_D4': ('        this->name = name;\n        this->marks = marks;',
           '        name = name;\n        marks = marks;',
           'The constructor assigns the parameters to themselves (this-> is missing), so the object stores nothing.'),
 'U1_D5': ('if (score > highest) {', 'if (score >= highest) {',
           'A tie with >= replaces the earlier top player, but a tie must keep the FIRST player.'),
 'U2_D1': ('return Complex(real * other.real - imag * other.imag, real * other.imag + imag * other.real);',
           'return Complex(imag * other.imag - real * other.real, real * other.imag + imag * other.real);',
           'The operands of the subtraction in operator* are swapped: the real part must be ac - bd, not bd - ac.'),
 'U2_D2': ('Phone(string b, int s) : Device(b) {', 'Phone(string b, int s) : Device("Generic") {',
           'Phone does not pass the brand to the Device constructor, so the base prints and stores the wrong brand.'),
 'U2_D3': ('    double x, y;', '    int x, y;',
           'The two double values are read into int variables, so the int overload is called and decimals are lost.'),
 'U2_D4': ('if (seats > available) {', 'if (seats >= available) {',
           'book uses >= instead of >, so booking exactly all the remaining seats wrongly throws.'),
 'U2_D5': ('    virtual double salary() {', '    double salary() {',
           'The virtual keyword is missing, so base pointers call the base salary() and every line prints the base pay.'),
 'U3_D1': ('        curr = nextNode;\n    }\n    return prev;',
           '        curr = nextNode;\n    }\n    return head;',
           'reverseList returns the old head instead of prev, so the reversed list loses all but one node.'),
 'U3_D2': ('            if (count == capacity) {', '            if (rear == capacity - 1) {',
           'Queue Full checks rear == capacity - 1 instead of count == capacity, which breaks after the queue wraps around.'),
 'U3_D3': ('    for (int i = 0; i < steps; i++) {', '    for (int i = 0; i < steps - 1; i++) {',
           'valueAfterSteps walks steps - 1 times instead of steps, so it reports the wrong player.'),
 'U3_D4': ('''            int b = stack[top];
            top = top - 1;
            int a = stack[top];
            top = top - 1;''',
           '''            int a = stack[top];
            top = top - 1;
            int b = stack[top];
            top = top - 1;''',
           'The operands are popped in the wrong order (a before b), so - and / are computed backwards.'),
 'U3_D5': ('''    if (head == NULL) {
        tail = newNode;
    } else {
        head->prev = newNode;
    }''',
           '''    if (head != NULL) {
        head->prev = newNode;
    }''',
           'insertFront never updates tail when the list was empty, so backward printing starts from NULL.'),
 'U4_D1': ('''    cout << " " << root->data;
    preorder(root->left);
    preorder(root->right);''',
           '''    preorder(root->left);
    preorder(root->right);
    cout << " " << root->data;''',
           'Preorder prints the root LAST (it became postorder); the root must be visited FIRST.'),
 'U4_D2': ('''int findMin(Node* root) {
    Node* temp = root;
    while (temp->left != NULL) {''',
           '''int findMin(Node* root) {
    Node* temp = root;
    while (temp->right != NULL) {''',
           'findMin walks to the right child, so it returns the MAXIMUM instead of the minimum.'),
 'U4_D3': ('''    y->left = x->right;
    x->right = y;
    return x;''',
           '''    y->left = x->right;
    x->right = y;
    return y;''',
           'rotateRight forgets to return the new subtree root x (it returns the old root y), so the rotation is lost.'),
 'U4_D4': ('''            Node* right = stack[top];
            top = top - 1;
            Node* left = stack[top];
            top = top - 1;''',
           '''            Node* left = stack[top];
            top = top - 1;
            Node* right = stack[top];
            top = top - 1;''',
           'The operands are popped in the wrong order when building the tree, mirroring every - and / subtree.'),
 'U4_D5': ('''        if (temp->isEnd) {
            return "Found";
        }
        return "Not Found";''',
           '''        return "Found";''',
           'search reports Found when the walk succeeds even if isEnd is false - a prefix-only match is not a word.'),
 'U5_D1': ('''    adj[u][v] = 1;
    adj[v][u] = 1;''',
           '''    adj[u][v] = 1;''',
           'addEdge sets only adj[u][v]; an undirected road must set BOTH adj[u][v] and adj[v][u].'),
 'U5_D2': ('''bool dfs(int n, int u, int parent) {''',
           '''bool dfs(int n, int u) {''',
           'The parent parameter was dropped (plus its two call sites and the v != parent check), so every visited neighbour looks like a cycle.'),
 'U5_D3': ('''    for (int i = 0; i < n; i++) {
        dist[i] = -1;
    }''',
           '''    for (int i = 0; i < n; i++) {
        dist[i] = 0;
    }''',
           'dist is initialised to 0 instead of -1, so the visited test always fails and unreachable stations print 0.'),
 'U5_D4': ('''            if (!inTree[v] && (u == -1 || key[v] < key[u])) {
                u = v;
            }''',
           '''            if (!inTree[v] && u == -1) {
                u = v;
            }''',
           'The pick step ignores the keys (u == -1 only), so Prim takes vertices in index order instead of by smallest key.'),
 'U5_D5': ('''            if (graph[u][v] > 0 && !done[v] && dist[u] + graph[u][v] < dist[v]) {''',
           '''            if (graph[u][v] >= 0 && !done[v] && dist[u] + graph[u][v] < dist[v]) {''',
           'Relaxation treats 0 entries as roads (>= 0 instead of > 0), but 0 in the matrix means NO road - all distances collapse to wrong values.'),
}

# U5_D2 needs its three companion edits applied together
BUGS_EXTRA = {
 'U5_D5': [
   ('''        if (dist[i] == 1000000000) {
            cout << " INF";
        } else {
            cout << " " << dist[i];
        }''',
    '''        cout << " " << dist[i];'''),
 ],
 'U5_D2': [
   ('''            } else if (v != parent) {
                return true;
            }''',
    '''            } else {
                return true;
            }'''),
   ('                if (dfs(n, v, u)) {', '                if (dfs(n, v)) {'),
   ('            if (dfs(n, i, -1)) {', '            if (dfs(n, i)) {'),
 ],
}

# ------------- extra hidden test inputs for U4/U5 (outputs computed from verified reference solutions) -------------
EXTRA_INPUTS = {
 'U4_D1': ['7\n50 30 70 20 40 60 80\n', '5\n100 50 150 25 75\n'],
 'U4_D2': ['6\n45 25 65 15 35 55\n35\n', '5\n10 20 30 40 50\n99\n'],
 'U4_D3': ['4\n60 50 40\n', '5\n30 10 20 40 5\n'],
 'U4_D4': ['231*+\n', '82/4+\n'],
 'U4_D5': ['4\ncat car cow dog\n4\ncat cage dog donkey\n', '3\nhello help heart\n3\nhe hello helped\n'],
 'U4_C1': ['7\n1 2\n3 4\n5 6\n-1 -1\n-1 -1\n-1 -1\n-1 -1\n', '4\n1 2\n-1 -1\n-1 -1\n-1 -1\n'],
 'U4_C2': ['3\n10 B 1 2\n5 R -1 -1\n20 B -1 -1\n', '4\n10 B 1 2\n5 R -1 -1\n20 R -1 -1\n30 B -1 -1\n'],
 'U4_C3': ['4\nred rose rat ram\n3\nr ro ra\n', '5\napple apply app axe bee\n3\napp ap x\n'],
 'U4_C4': ['4\n30 20 10\n', '5\n50 30 70 20 60\n'],
 'U5_D1': ['5 4\n0 1\n2 3\n2 4\n3 4\n', '4 5\n0 1\n0 2\n1 2\n1 3\n2 3\n'],
 'U5_D2': ['4 3\n0 1\n1 2\n2 3\n', '6 6\n0 1\n1 2\n2 0\n3 4\n4 5\n5 3\n'],
 'U5_D3': ['6 5\n0 1\n0 2\n1 3\n2 4\n4 5\n0\n', '5 2\n0 4\n2 3\n3\n'],
 'U5_D4': ['4 3\n0 1 1\n1 2 2\n2 3 3\n', '5 4\n0 1 2\n0 2 4\n1 3 1\n2 4 7\n'],
 'U5_D5': ['4 3\n0 1 1\n1 2 2\n2 3 3\n0\n', '5 3\n0 1 4\n2 3 1\n3 4 1\n0\n'],
 'U5_C1': ['6 6\n0 1\n0 2\n1 3\n2 3\n3 4\n4 5\n', '3 3\n0 1\n1 2\n2 0\n'],
 'U5_C2': ['4 4\n0 1\n0 3\n1 2\n2 3\n', '3 3\n0 1\n1 2\n2 0\n'],
 'U5_C3': ['4 4\n0 1 4\n1 2 -2\n0 2 5\n2 3 2\n', '3 3\n0 1 2\n1 2 3\n0 2 4\n'],
 'U5_C4': ['6 2\n0 1\n3 4\n', '5 4\n0 1\n1 2\n2 3\n3 4\n'],
}

def sh(cmd, **kw):
    return subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, **kw)

def compile_cpp(code, workdir):
    src = os.path.join(workdir, 'prog.cpp')
    exe = os.path.join(workdir, 'prog')
    with open(src, 'w') as f:
        f.write(code)
    p = sh(['g++', '-std=c++17', '-O2', '-o', exe, src], timeout=60)
    return (p.returncode == 0), p.stderr.decode(errors='replace'), exe

def run_exe(exe, inp, timeout=5):
    try:
        p = sh([exe], input=inp.encode(), timeout=timeout)
        return p.stdout.decode(errors='replace'), p.stderr.decode(errors='replace'), p.returncode
    except subprocess.TimeoutExpired:
        return '', 'TIME LIMIT EXCEEDED', 124

def norm(s):
    s = s.replace('\r\n', '\n').replace('\r', '\n')
    lines = [l.rstrip() for l in s.split('\n')]
    while lines and lines[-1] == '':
        lines.pop()
    return '\n'.join(lines)

def check_solution(qid, code, tests):
    """Compile reference solution and run all tests. Returns (ok, fails, err)."""
    work = tempfile.mkdtemp(prefix='ver_')
    try:
        ok, err, exe = compile_cpp(code, work)
        if not ok:
            return False, [], err
        fails = []
        for t in tests:
            inp, expected = t['input'], t['expected']
            actual, _, rc = run_exe(exe, inp)
            if norm(actual) != norm(expected):
                fails.append((tag, inp, expected, actual))
        return True, fails, ''
    finally:
        shutil.rmtree(work, ignore_errors=True)

def parse_statement(st):
    im = re.search(r'Input Format:(.*?)(?:Output Format:|$)', st, re.S)
    om = re.search(r'Output Format:(.*?)(?:Constraints:|$)', st, re.S)
    cm = re.search(r'Constraints:(.*?)$', st, re.S)
    main = st.split('Input Format:')[0].strip()
    return (main,
            ' '.join(im.group(1).split()) if im else '',
            ' '.join(om.group(1).split()) if om else '',
            ' '.join(cm.group(1).split()) if cm else '')

def plant_bug(qid, code):
    find, repl, label = BUGS[qid]
    if find not in code:
        raise RuntimeError(f'{qid}: primary patch target not found')
    buggy = code.replace(find, repl, 1)
    for f2, r2 in BUGS_EXTRA.get(qid, []):
        if f2 not in buggy:
            raise RuntimeError(f'{qid}: companion patch target not found: {f2[:50]}')
        buggy = buggy.replace(f2, r2, 1)
    return buggy, label

def main():
    questions = []
    report = []
    errors = []
    for u in range(1, 6):
        meta = json.load(open(f'{META}/u{u}_meta.json'))
        tests = json.load(open(f'{SOL}/tests_u{u}.json'))
        for q in meta:
            qid = q['id']
            kind = q['kind']
            sol_path = f'{SOL}/{qid}.cpp'
            sol_code = open(sol_path).read()
            raw_tests = tests.get(qid, [])
            tcs = [{'input': t[0], 'expected': t[1],
                    'tag': 'sample' if t[2] in SAMPLE_TAGS else 'hidden'} for t in raw_tests]

            # guarantee at least 2 sample cases for the Run button (QB cases whose
            # outputs were recovered/inferred are promoted when no plain sample exists)
            if not any(t['tag'] == 'sample' for t in tcs):
                for t in tcs[:2]:
                    t['tag'] = 'sample'

            # 1. re-verify the reference solution (integrity of the whole dataset)
            ok, fails, err = check_solution(qid, sol_code, tcs)
            if not ok:
                errors.append(f'{qid}: REFERENCE does not compile:\n{err[:400]}')
                continue
            if fails:
                errors.append(f'{qid}: REFERENCE fails {len(fails)}/{len(tcs)} tests')
                continue

            # 2. extra hidden tests (U4/U5): outputs computed by the verified reference
            work = tempfile.mkdtemp(prefix='ext_')
            try:
                okc, errc, exe = compile_cpp(sol_code, work)
                extra = []
                if okc and qid in EXTRA_INPUTS:
                    for inp in EXTRA_INPUTS[qid]:
                        actual, _, rc = run_exe(exe, inp)
                        if rc == 0 and norm(actual) != '':
                            extra.append({'input': inp, 'expected': actual.rstrip('\n'), 'tag': 'extra'})
                tcs = tcs + extra
            finally:
                shutil.rmtree(work, ignore_errors=True)

            # 3. starter code
            bug_label = ''
            if kind == 'Coding':
                starter = SKELETON
            else:
                buggy, bug_label = plant_bug(qid, sol_code)
                bok, berr, bexe_path = None, '', None
                w2 = tempfile.mkdtemp(prefix='bug_')
                try:
                    bok, berr, bexe = compile_cpp(buggy, w2)
                    if not bok:
                        errors.append(f'{qid}: BUGGY starter does not compile:\n{berr[:400]}')
                        starter = buggy
                    else:
                        bfail = 0
                        for t in tcs:
                            if t['tag'] == 'extra':
                                continue
                            actual, _, _ = run_exe(bexe, t['input'])
                            if norm(actual) != norm(t['expected']):
                                bfail += 1
                        if bfail == 0:
                            errors.append(f'{qid}: BUGGY starter passes ALL tests - patch is ineffective!')
                        else:
                            report.append(f'{qid}: planted bug fails {bfail} QB test(s) [OK]')
                finally:
                    shutil.rmtree(w2, ignore_errors=True)
                starter = buggy

            main_stmt, infmt, outfmt, constraints = parse_statement(q['statement'])
            questions.append({
                'id': qid,
                'unit': u,
                'kind': kind,
                'title': q['title'],
                'statement': main_stmt,
                'inputFormat': infmt,
                'outputFormat': outfmt,
                'constraints': constraints,
                'easy': q['easy'],
                'logic': q['logic'],
                'algorithm': q['algorithm'],
                'mistakes': q['mistakes'],
                'starterCode': starter,
                'referenceSolution': sol_code,
                'bugLabel': bug_label if kind == 'Debugging' else '',
                'tests': tcs,
            })

    # ---------------- MCQs ----------------
    mcqs = []
    for u in range(1, 6):
        data = json.load(open(f'{META}/mcq_u{u}.json'))
        for e in data:
            mid = f'U{u}_Q{e["n"]}'
            code = ''
            vout, vopt = '', ''
            mpath = f'{SOL}/mcq_code/{mid}.cpp'
            res = json.load(open(f'{SOL}/mcq_results.json'))
            if mid in res:
                if os.path.exists(mpath):
                    code = open(mpath).read()
                vout = res[mid].get('output', '')
                vopt = res[mid].get('match_option', '')
            mcqs.append({
                'id': mid,
                'unit': u,
                'n': e['n'],
                'topic': e.get('topic', ''),
                'q': e['q'],
                'code': code,
                'opts': e['opts'],
                'ans': e['ans'],
                'ansText': e.get('ansText', ''),
                'expl': e.get('expl', ''),
                'verifiedOutput': vout,
                'verifiedOption': vopt,
            })

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    payload = {
        'generated': '2026-11-14',
        'source': 'Units 1-5 QB (original DOCX files), solutions re-verified with g++ C++17',
        'questions': questions,
        'mcqs': mcqs,
    }
    with open(OUT, 'w') as f:
        json.dump(payload, f, indent=1)

    print(f'Wrote {OUT}: {len(questions)} code questions, {len(mcqs)} MCQs')
    print(f'Size: {os.path.getsize(OUT)//1024} KB')
    print(f'Integrity: {len(report)} planted-bug checks OK, {len(errors)} ERRORS')
    for e in errors:
        print('ERROR:', e[:300])
    for r in report[:6]:
        print('  ', r)
    print('  ...')
    sample_counts = {}
    for q in questions:
        n_s = sum(1 for t in q['tests'] if t['tag'] == 'sample')
        n_h = len(q['tests']) - n_s
        sample_counts[q['unit']] = sample_counts.get(q['unit'], 0) + 1
    print('Per unit question counts:', sample_counts)
    return 1 if errors else 0

if __name__ == '__main__':
    sys.exit(main())
