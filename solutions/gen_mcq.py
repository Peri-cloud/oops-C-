#!/usr/bin/env python3
"""Write all code-based MCQ snippets (transcribed from QB text/images) and run them."""
import os, subprocess, json

S = '/home/z/my-project/scripts/solutions'
B = '/tmp/mcq'
os.makedirs(B, exist_ok=True)

MCQ = {}

# ---------------- Unit 3 (transcribed from embedded images) ----------------
MCQ['U3_Q14'] = ('''#include <iostream>
using namespace std;
struct Node {
    int data;
    Node *next;
};
int main() {
    Node c = {30, NULL};
    Node b = {20, &c};
    Node a = {10, &b};
    int sum = 0;
    for (Node *p = &a; p != NULL; p = p->next)
        sum += p->data;
    cout << sum;
    return 0;
}''', ['30', '50', '60', '20'])

MCQ['U3_Q16'] = ('''#include <iostream>
using namespace std;
int main() {
    int s[10], top = -1;
    s[++top] = 2;
    s[++top] = 3;
    s[++top] = 4;
    int b = s[top--];
    int a = s[top--];
    s[++top] = a * b;
    b = s[top--];
    a = s[top--];
    s[++top] = a + b;
    cout << s[top];
    return 0;
}''', ['20', '24', '14', '9'])

MCQ['U3_Q17'] = ('''#include <iostream>
using namespace std;
struct Node {
    int data;
    Node *next;
};
int main() {
    Node a = {1, NULL}, b = {2, NULL}, c = {3, NULL};
    a.next = &b; b.next = &c; c.next = &a;
    Node *p = &b;
    int count = 0;
    do {
        cout << p->data << " ";
        p = p->next;
        count++;
    } while (p != &b);
    cout << count;
    return 0;
}''', ['2 3 1 3', '2 3 1 2', '1 2 3 3', '2 3 3'])

MCQ['U3_Q18'] = ('''#include <iostream>
using namespace std;
int main() {
    int pq[5] = {30, 10, 50, 20, 40};
    int n = 5, maxIdx = 0;
    for (int i = 1; i < n; i++)
        if (pq[i] > pq[maxIdx])
            maxIdx = i;
    cout << pq[maxIdx] << " " << maxIdx;
    return 0;
}''', ['30 0', '10 1', '40 4', '50 2'])

MCQ['U3_Q19'] = ('''#include <iostream>
using namespace std;
struct Node {
    int data;
    Node *prev, *next;
};
int main() {
    Node a = {1, NULL, NULL}, b = {2, NULL, NULL}, c = {3, NULL, NULL};
    a.next = &b; b.prev = &a;
    b.next = &c; c.prev = &b;
    Node *p = &c;
    while (p != NULL) {
        cout << p->data << " ";
        p = p->prev;
    }
    return 0;
}''', ['1 2 3', '3 1', '2 3 1', '3 2 1'])

# ---------------- Unit 4 (code printed as text in the QB) ----------------
MCQ['U4_Q13'] = ('''#include <iostream>
using namespace std;
struct Node {
    int data;
    Node *left, *right;
};
void postorder(Node *p) {
    if (p == NULL)
        return;
    postorder(p->left);
    postorder(p->right);
    cout << p->data << " ";
}
int main() {
    Node n1 = {1, NULL, NULL}, n3 = {3, NULL, NULL}, n7 = {7, NULL, NULL};
    Node n2 = {2, &n1, &n3};
    Node n5 = {5, &n2, &n7};
    postorder(&n5);
    return 0;
}''', ['5 2 1 3 7', '1 2 3 5 7', '7 5 3 2 1', '1 3 2 7 5'])

MCQ['U4_Q16'] = ('''#include <iostream>
using namespace std;
struct Node {
    char op;
    int val;
    Node *left, *right;
};
int eval(Node *p) {
    if (p->left == NULL && p->right == NULL)
        return p->val;
    int l = eval(p->left);
    int r = eval(p->right);
    if (p->op == '+')
        return l + r;
    return l * r;
}
int main() {
    Node two = {'0', 2, NULL, NULL};
    Node three = {'0', 3, NULL, NULL};
    Node four = {'0', 4, NULL, NULL};
    Node plus = {'+', 0, &two, &three};
    Node mul = {'*', 0, &plus, &four};
    cout << eval(&mul);
    return 0;
}''', ['14', '20', '24', '9'])

MCQ['U4_Q17'] = ('''#include <iostream>
using namespace std;
int nodes = 0;
struct TrieNode {
    TrieNode *child[26];
    TrieNode() {
        for (int i = 0; i < 26; i++)
            child[i] = NULL;
        nodes++;
    }
};
void insert(TrieNode *root, const char *s) {
    TrieNode *p = root;
    for (int i = 0; s[i] != '\\0'; i++) {
        int idx = s[i] - 'a';
        if (p->child[idx] == NULL)
            p->child[idx] = new TrieNode();
        p = p->child[idx];
    }
}
int main() {
    TrieNode *root = new TrieNode();
    insert(root, "to");
    insert(root, "tea");
    insert(root, "ten");
    cout << nodes;
    return 0;
}''', ['4', '5', '7', '6'])

MCQ['U4_Q18'] = ('''#include <iostream>
using namespace std;
struct Node {
    int data;
    Node *left, *right;
};
Node* insert(Node *root, int key) {
    if (root == NULL) {
        Node *n = new Node;
        n->data = key;
        n->left = n->right = NULL;
        return n;
    }
    if (key < root->data)
        root->left = insert(root->left, key);
    else
        root->right = insert(root->right, key);
    return root;
}
int main() {
    Node *root = NULL;
    int keys[] = {50, 30, 70, 20, 40};
    for (int i = 0; i < 5; i++)
        root = insert(root, keys[i]);
    cout << root->left->right->data << " " << root->right->data;
    return 0;
}''', ['40 70', '20 70', '30 70', '40 30'])

MCQ['U4_Q19'] = ('''#include <iostream>
using namespace std;
struct Node {
    int data;
    Node *left, *right;
};
int main() {
    Node n10 = {10, NULL, NULL};
    Node n20 = {20, &n10, NULL};
    Node n30 = {30, &n20, NULL};
    Node *y = &n30;
    Node *x = y->left;
    y->left = x->right;
    x->right = y;
    cout << x->data << " " << x->left->data << " " << x->right->data;
    return 0;
}''', ['30 20 10', '10 20 30', '20 10 30', '20 30 10'])

MCQ['U4_Q20'] = ('''#include <iostream>
using namespace std;
struct TrieNode {
    TrieNode *child[26];
    bool end;
    TrieNode() {
        for (int i = 0; i < 26; i++)
            child[i] = NULL;
        end = false;
    }
};
void insert(TrieNode *root, const char *s) {
    TrieNode *p = root;
    for (int i = 0; s[i] != '\\0'; i++) {
        int idx = s[i] - 'a';
        if (p->child[idx] == NULL)
            p->child[idx] = new TrieNode();
        p = p->child[idx];
    }
    p->end = true;
}
bool search(TrieNode *root, const char *s) {
    TrieNode *p = root;
    for (int i = 0; s[i] != '\\0'; i++) {
        int idx = s[i] - 'a';
        if (p->child[idx] == NULL)
            return false;
        p = p->child[idx];
    }
    return p->end;
}
int main() {
    TrieNode *root = new TrieNode();
    insert(root, "ear");
    insert(root, "ear");
    cout << search(root, "ear") << search(root, "ea") << search(root, "dog");
    return 0;
}''', ['111', '101', '100', '110'])

# ---------------- Unit 5 (code printed as text in the QB) ----------------
MCQ['U5_Q14'] = ('''#include <iostream>
using namespace std;
int main() {
    int g[4][4] = {{0,1,1,0},{1,0,1,1},{1,1,0,0},{0,1,0,0}};
    int deg[4] = {0};
    for (int i = 0; i < 4; i++)
        for (int j = 0; j < 4; j++)
            deg[i] += g[i][j];
    for (int i = 0; i < 4; i++)
        cout << deg[i] << " ";
    return 0;
}''', ['3 2 3 1', '2 2 3 1', '2 3 2 1', '1 2 3 2'])

MCQ['U5_Q16'] = ('''#include <iostream>
using namespace std;
int main() {
    int w[4][4] = {{0,2,6,0},{2,0,3,8},{6,3,0,5},{0,8,5,0}};
    bool inTree[4] = {true, false, false, false};
    int total = 0;
    for (int k = 1; k < 4; k++) {
        int best = 1000, bv = -1;
        for (int i = 0; i < 4; i++)
            if (inTree[i])
                for (int j = 0; j < 4; j++)
                    if (!inTree[j] && w[i][j] != 0 && w[i][j] < best) {
                        best = w[i][j];
                        bv = j;
                    }
        inTree[bv] = true;
        total += best;
    }
    cout << total;
    return 0;
}''', ['11', '8', '10', '13'])

MCQ['U5_Q17'] = ('''#include <iostream>
using namespace std;
int main() {
    int g[5][5] = {{0,1,1,0,0},{1,0,0,0,1},{1,0,0,1,0},{0,0,1,0,1},{0,1,0,1,0}};
    int q[10], front = 0, rear = 0;
    bool visited[5] = {false};
    q[rear++] = 0;
    visited[0] = true;
    while (front < rear) {
        int v = q[front++];
        cout << v << " ";
        for (int i = 0; i < 5; i++)
            if (g[v][i] && !visited[i]) {
                visited[i] = true;
                q[rear++] = i;
            }
    }
    return 0;
}''', ['0 1 2 3 4', '0 2 1 3 4', '0 1 4 2 3', '0 1 2 4 3'])

MCQ['U5_Q18'] = ('''#include <iostream>
using namespace std;
int main() {
    int u[4] = {0, 0, 1, 2};
    int v[4] = {1, 2, 2, 3};
    int w[4] = {4, 5, -3, 2};
    int dist[4] = {0, 1000, 1000, 1000};
    for (int pass = 1; pass <= 3; pass++)
        for (int e = 0; e < 4; e++)
            if (dist[u[e]] != 1000 && dist[u[e]] + w[e] < dist[v[e]])
                dist[v[e]] = dist[u[e]] + w[e];
    for (int i = 0; i < 4; i++)
        cout << dist[i] << " ";
    return 0;
}''', ['0 4 5 7', '0 4 1 7', '0 5 1 3', '0 4 1 3'])

MCQ['U5_Q19'] = ('''#include <iostream>
using namespace std;
int main() {
    int g[4][4] = {{0,1,1,0},{0,0,0,1},{0,0,0,1},{0,0,0,0}};
    int indeg[4] = {0}, q[4], front = 0, rear = 0;
    for (int i = 0; i < 4; i++)
        for (int j = 0; j < 4; j++)
            indeg[j] += g[i][j];
    for (int i = 0; i < 4; i++)
        if (indeg[i] == 0)
            q[rear++] = i;
    while (front < rear) {
        int v = q[front++];
        cout << v << " ";
        for (int j = 0; j < 4; j++)
            if (g[v][j] && --indeg[j] == 0)
                q[rear++] = j;
    }
    return 0;
}''', ['0 2 1 3', '0 1 2 3', '0 1 3 2', '3 2 1 0'])

MCQ['U5_Q20'] = ('''#include <iostream>
using namespace std;
int g[5][5] = {{0,1,1,0,0},{1,0,0,0,1},{1,0,0,1,0},{0,0,1,0,1},{0,1,0,1,0}};
bool visited[5];
void dfs(int v) {
    visited[v] = true;
    cout << v << " ";
    for (int i = 0; i < 5; i++)
        if (g[v][i] && !visited[i])
            dfs(i);
}
int main() {
    dfs(2);
    return 0;
}''', ['2 0 1 4 3', '2 0 1 3 4', '2 3 4 1 0', '2 3 0 1 4'])

results = {}
os.makedirs(f'{S}/mcq_code', exist_ok=True)
for k, (code, opts) in MCQ.items():
    src = f'{B}/{k}.cpp'
    with open(src, 'w') as f:
        f.write(code + '\n')
    with open(f'{S}/mcq_code/{k}.cpp', 'w') as f:
        f.write(code + '\n')
    r = subprocess.run(['g++', '-std=c++17', '-o', f'{B}/{k}.bin', src],
                       capture_output=True, text=True)
    if r.returncode != 0:
        results[k] = {'compile': 'FAIL', 'err': r.stderr[:300]}
        continue
    r = subprocess.run([f'{B}/{k}.bin'], capture_output=True, text=True, timeout=10)
    out = r.stdout.strip()
    match = None
    for i, o in enumerate(opts):
        if o.strip() == out:
            match = chr(65 + i)
    results[k] = {'compile': 'OK', 'output': out, 'options': opts, 'match_option': match}

with open(f'{S}/mcq_results.json', 'w') as f:
    json.dump(results, f, indent=1)
for k, v in results.items():
    print(k, '->', v.get('output', v.get('err', ''))[:60], '| option:', v.get('match_option', 'NO MATCH'))
