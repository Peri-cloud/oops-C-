#!/usr/bin/env python3
"""Unit 4: write QB solutions as .cpp files + test cases JSON.
Source anomalies handled: D2 sample1 missing n-line, D4 sample2 input corrupted ('+'),
D5 sample2 missing n-line. Reconstructed inputs are tagged 'reconstructed'."""
import json, os

S = '/home/z/my-project/scripts/solutions'

CODE = {}

CODE['U4_D1'] = '''#include <iostream>
using namespace std;
struct Node {
    int data;
    Node* left;
    Node* right;
};
Node* insert(Node* root, int value) {
    if (root == NULL) {
        Node* node = new Node;
        node->data = value;
        node->left = NULL;
        node->right = NULL;
        return node;
    }
    if (value < root->data) {
        root->left = insert(root->left, value);
    } else {
        root->right = insert(root->right, value);
    }
    return root;
}
void preorder(Node* root) {
    if (root == NULL) {
        return;
    }
    cout << " " << root->data;
    preorder(root->left);
    preorder(root->right);
}
void inorder(Node* root) {
    if (root == NULL) {
        return;
    }
    inorder(root->left);
    cout << " " << root->data;
    inorder(root->right);
}
void postorder(Node* root) {
    if (root == NULL) {
        return;
    }
    postorder(root->left);
    postorder(root->right);
    cout << " " << root->data;
}
void printPreorder(Node* root) {
    cout << "Preorder:";
    preorder(root);
    cout << endl;
}
void printInorder(Node* root) {
    cout << "Inorder:";
    inorder(root);
    cout << endl;
}
void printPostorder(Node* root) {
    cout << "Postorder:";
    postorder(root);
    cout << endl;
}
int main() {
    int n;
    cin >> n;
    Node* root = NULL;
    for (int i = 0; i < n; i++) {
        int value;
        cin >> value;
        root = insert(root, value);
    }
    printPreorder(root);
    printInorder(root);
    printPostorder(root);
    return 0;
}'''

CODE['U4_D2'] = '''#include <iostream>
#include <string>
using namespace std;
struct Node {
    int data;
    Node* left;
    Node* right;
};
Node* insert(Node* root, int value) {
    if (root == NULL) {
        Node* node = new Node;
        node->data = value;
        node->left = NULL;
        node->right = NULL;
        return node;
    }
    if (value < root->data) {
        root->left = insert(root->left, value);
    } else {
        root->right = insert(root->right, value);
    }
    return root;
}
string searchResult(Node* root, int key) {
    Node* temp = root;
    while (temp != NULL) {
        if (key == temp->data) {
            return "Found";
        } else if (key < temp->data) {
            temp = temp->left;
        } else {
            temp = temp->right;
        }
    }
    return "Not Found";
}
int findMin(Node* root) {
    Node* temp = root;
    while (temp->left != NULL) {
        temp = temp->left;
    }
    return temp->data;
}
int findMax(Node* root) {
    Node* temp = root;
    while (temp->right != NULL) {
        temp = temp->right;
    }
    return temp->data;
}
int main() {
    int n, key;
    cin >> n;
    Node* root = NULL;
    for (int i = 0; i < n; i++) {
        int value;
        cin >> value;
        root = insert(root, value);
    }
    cin >> key;
    cout << "Search: " << searchResult(root, key) << endl;
    cout << "Minimum: " << findMin(root) << endl;
    cout << "Maximum: " << findMax(root) << endl;
    return 0;
}'''

CODE['U4_D3'] = '''#include <iostream>
using namespace std;
struct Node {
    int data;
    Node* left;
    Node* right;
};
Node* insert(Node* root, int value) {
    if (root == NULL) {
        Node* node = new Node;
        node->data = value;
        node->left = NULL;
        node->right = NULL;
        return node;
    }
    if (value < root->data) {
        root->left = insert(root->left, value);
    } else {
        root->right = insert(root->right, value);
    }
    return root;
}
int height(Node* root) {
    if (root == NULL) {
        return 0;
    }
    int l = height(root->left);
    int r = height(root->right);
    if (l > r) {
        return l + 1;
    }
    return r + 1;
}
int balanceFactor(Node* root) {
    return height(root->left) - height(root->right);
}
Node* rotateRight(Node* y) {
    Node* x = y->left;
    y->left = x->right;
    x->right = y;
    return x;
}
Node* rotateLeft(Node* x) {
    Node* y = x->right;
    x->right = y->left;
    y->left = x;
    return y;
}
Node* rebalance(Node* root) {
    int bf = balanceFactor(root);
    if (bf > 1) {
        return rotateRight(root);
    }
    if (bf < -1) {
        return rotateLeft(root);
    }
    return root;
}
void preorder(Node* root) {
    if (root == NULL) {
        return;
    }
    cout << " " << root->data;
    preorder(root->left);
    preorder(root->right);
}
void printPreorder(Node* root) {
    cout << "Preorder After Balancing:";
    preorder(root);
    cout << endl;
}
int main() {
    int n;
    cin >> n;
    Node* root = NULL;
    for (int i = 0; i < n; i++) {
        int value;
        cin >> value;
        root = insert(root, value);
    }
    root = rebalance(root);
    printPreorder(root);
    return 0;
}'''

CODE['U4_D4'] = '''#include <iostream>
#include <string>
using namespace std;
struct Node {
    char data;
    Node* left;
    Node* right;
};
Node* newNode(char c) {
    Node* node = new Node;
    node->data = c;
    node->left = NULL;
    node->right = NULL;
    return node;
}
Node* build(string postfix) {
    Node* stack[50];
    int top = -1;
    for (int i = 0; i < postfix.length(); i++) {
        char c = postfix[i];
        Node* node = newNode(c);
        if (c < '0' || c > '9') {
            Node* right = stack[top];
            top = top - 1;
            Node* left = stack[top];
            top = top - 1;
            node->left = left;
            node->right = right;
        }
        top = top + 1;
        stack[top] = node;
    }
    return stack[top];
}
int evaluate(Node* root) {
    if (root->left == NULL && root->right == NULL) {
        return root->data - '0';
    }
    int l = evaluate(root->left);
    int r = evaluate(root->right);
    if (root->data == '+') {
        return l + r;
    }
    if (root->data == '-') {
        return l - r;
    }
    if (root->data == '*') {
        return l * r;
    }
    return l / r;
}
void infix(Node* root) {
    if (root->left == NULL && root->right == NULL) {
        cout << root->data;
        return;
    }
    cout << "(";
    infix(root->left);
    cout << root->data;
    infix(root->right);
    cout << ")";
}
void printInfix(Node* root) {
    cout << "Infix: ";
    infix(root);
    cout << endl;
}
int main() {
    string expr;
    cin >> expr;
    Node* root = build(expr);
    printInfix(root);
    cout << "Value: " << evaluate(root) << endl;
    return 0;
}'''

CODE['U4_D5'] = '''#include <iostream>
#include <string>
using namespace std;
struct TrieNode {
    TrieNode* children[26];
    bool isEnd;
};
TrieNode* createNode() {
    TrieNode* node = new TrieNode;
    for (int i = 0; i < 26; i++) {
        node->children[i] = NULL;
    }
    node->isEnd = false;
    return node;
}
class Trie {
    TrieNode* root;
public:
    Trie() {
        root = createNode();
    }
    void insert(string word) {
        TrieNode* temp = root;
        for (int i = 0; i < word.length(); i++) {
            int index = word[i] - 'a';
            if (temp->children[index] == NULL) {
                temp->children[index] = createNode();
            }
            temp = temp->children[index];
        }
        temp->isEnd = true;
    }
    string search(string word) {
        TrieNode* temp = root;
        for (int i = 0; i < word.length(); i++) {
            int index = word[i] - 'a';
            if (temp->children[index] == NULL) {
                return "Not Found";
            }
            temp = temp->children[index];
        }
        if (temp->isEnd) {
            return "Found";
        }
        return "Not Found";
    }
};
int main() {
    int n, q;
    cin >> n;
    Trie t;
    for (int i = 0; i < n; i++) {
        string word;
        cin >> word;
        t.insert(word);
    }
    cin >> q;
    for (int i = 0; i < q; i++) {
        string word;
        cin >> word;
        cout << word << ": " << t.search(word) << endl;
    }
    return 0;
}'''

CODE['U4_C1'] = '''#include <iostream>
using namespace std;
int n;
int leftChild[50];
int rightChild[50];
int height(int node) {
    if (node == -1) {
        return -1;
    }
    int l = height(leftChild[node]);
    int r = height(rightChild[node]);
    if (l > r) {
        return l + 1;
    }
    return r + 1;
}
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> leftChild[i] >> rightChild[i];
    }
    int leaves = 0;
    bool full = true;
    for (int i = 0; i < n; i++) {
        if (leftChild[i] == -1 && rightChild[i] == -1) {
            leaves = leaves + 1;
        } else if (leftChild[i] == -1 || rightChild[i] == -1) {
            full = false;
        }
    }
    cout << "Nodes: " << n << endl;
    cout << "Leaves: " << leaves << endl;
    cout << "Height: " << height(0) << endl;
    if (full) {
        cout << "Full Binary Tree: Yes" << endl;
    } else {
        cout << "Full Binary Tree: No" << endl;
    }
    return 0;
}'''

CODE['U4_C2'] = '''#include <iostream>
using namespace std;
int n;
char color[50];
int leftChild[50];
int rightChild[50];
int blackHeight(int node) {
    if (node == -1) {
        return 0;
    }
    if (color[node] == 'R') {
        if (leftChild[node] != -1 && color[leftChild[node]] == 'R') {
            return -1;
        }
        if (rightChild[node] != -1 && color[rightChild[node]] == 'R') {
            return -1;
        }
    }
    int l = blackHeight(leftChild[node]);
    int r = blackHeight(rightChild[node]);
    if (l == -1 || r == -1 || l != r) {
        return -1;
    }
    if (color[node] == 'B') {
        return l + 1;
    }
    return l;
}
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) {
        int key;
        cin >> key >> color[i] >> leftChild[i] >> rightChild[i];
    }
    if (color[0] == 'R') {
        cout << "Invalid Red-Black Tree" << endl;
        return 0;
    }
    int bh = blackHeight(0);
    if (bh == -1) {
        cout << "Invalid Red-Black Tree" << endl;
    } else {
        cout << "Valid Red-Black Tree" << endl;
        cout << "Black Height: " << bh << endl;
    }
    return 0;
}'''

CODE['U4_C3'] = '''#include <iostream>
#include <string>
using namespace std;
struct TrieNode {
    TrieNode* children[26];
    int count;
};
TrieNode* createNode() {
    TrieNode* node = new TrieNode;
    for (int i = 0; i < 26; i++) {
        node->children[i] = NULL;
    }
    node->count = 0;
    return node;
}
int main() {
    int n, q;
    cin >> n;
    TrieNode* root = createNode();
    for (int i = 0; i < n; i++) {
        string word;
        cin >> word;
        TrieNode* temp = root;
        for (int j = 0; j < word.length(); j++) {
            int index = word[j] - 'a';
            if (temp->children[index] == NULL) {
                temp->children[index] = createNode();
            }
            temp = temp->children[index];
            temp->count = temp->count + 1;
        }
    }
    cin >> q;
    for (int i = 0; i < q; i++) {
        string prefix;
        cin >> prefix;
        TrieNode* temp = root;
        int result = 0;
        bool found = true;
        for (int j = 0; j < prefix.length(); j++) {
            int index = prefix[j] - 'a';
            if (temp->children[index] == NULL) {
                found = false;
                break;
            }
            temp = temp->children[index];
        }
        if (found) {
            result = temp->count;
        }
        cout << prefix << ": " << result << endl;
    }
    return 0;
}'''

CODE['U4_C4'] = '''#include <iostream>
using namespace std;
int val[20];
int leftChild[20];
int rightChild[20];
int height(int node) {
    if (node == -1) {
        return 0;
    }
    int l = height(leftChild[node]);
    int r = height(rightChild[node]);
    if (l > r) {
        return l + 1;
    }
    return r + 1;
}
int balance(int node) {
    return height(leftChild[node]) - height(rightChild[node]);
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> val[i];
        leftChild[i] = -1;
        rightChild[i] = -1;
        if (i > 0) {
            int cur = 0;
            while (true) {
                if (val[i] < val[cur]) {
                    if (leftChild[cur] == -1) {
                        leftChild[cur] = i;
                        break;
                    }
                    cur = leftChild[cur];
                } else {
                    if (rightChild[cur] == -1) {
                        rightChild[cur] = i;
                        break;
                    }
                    cur = rightChild[cur];
                }
            }
        }
    }
    int bf = balance(0);
    cout << "Balance Factor: " << bf << endl;
    if (bf > 1) {
        if (balance(leftChild[0]) >= 0) {
            cout << "Rotation: LL" << endl;
        } else {
            cout << "Rotation: LR" << endl;
        }
    } else if (bf < -1) {
        if (balance(rightChild[0]) <= 0) {
            cout << "Rotation: RR" << endl;
        } else {
            cout << "Rotation: RL" << endl;
        }
    } else {
        cout << "Rotation: None" << endl;
    }
    return 0;
}'''

TESTS = {
 'U4_D1': [
  ('4\n8 3 10 1', 'Preorder: 8 3 1 10\nInorder: 1 3 8 10\nPostorder: 1 3 10 8', 'sample'),
  ('6\n15 10 20 8 12 25', 'Preorder: 15 10 8 12 20 25\nInorder: 8 10 12 15 20 25\nPostorder: 8 12 10 25 20 15', 'sample'),
 ],
 'U4_D2': [
  # QB sample 1 shows "50 30 70 20 40" + "40" without the leading count line; n=5 reconstructed from format spec
  ('5\n50 30 70 20 40\n40', 'Search: Found\nMinimum: 20\nMaximum: 70', 'reconstructed'),
  ('4\n12 8 18 4\n10', 'Search: Not Found\nMinimum: 4\nMaximum: 18', 'sample'),
 ],
 'U4_D3': [
  ('4\n40 30 20 10', 'Preorder After Balancing: 30 20 10 40', 'sample'),
  ('4\n5 10 15 20', 'Preorder After Balancing: 10 5 15 20', 'sample'),
 ],
 'U4_D4': [
  ('84/2*', 'Infix: ((8/4)*2)\nValue: 4', 'sample'),
  # QB sample 2 shows input "+" with output "(9+(5-1)) / 13"; the only postfix input consistent with that output is 951-+
  ('951-+', 'Infix: (9+(5-1))\nValue: 13', 'reconstructed'),
 ],
 'U4_D5': [
  ('3\nred green blue\n3\nred rose blue', 'red: Found\nrose: Not Found\nblue: Found', 'sample'),
  # QB sample 2 shows "sky skyline / 3 / sky skyl skyline" without the leading count line; n=2 reconstructed from format spec
  ('2\nsky skyline\n3\nsky skyl skyline', 'sky: Found\nskyl: Not Found\nskyline: Found', 'reconstructed'),
 ],
 'U4_C1': [
  ('5\n1 2\n3 4\n-1 -1\n-1 -1\n-1 -1', 'Nodes: 5\nLeaves: 3\nHeight: 2\nFull Binary Tree: Yes', 'sample'),
  ('4\n1 2\n3 -1\n-1 -1\n-1 -1', 'Nodes: 4\nLeaves: 2\nHeight: 2\nFull Binary Tree: No', 'sample'),
 ],
 'U4_C2': [
  ('3\n20 B 1 2\n10 R -1 -1\n30 R -1 -1', 'Valid Red-Black Tree\nBlack Height: 1', 'sample'),
  ('2\n10 B 1 -1\n5 B -1 -1', 'Invalid Red-Black Tree', 'sample'),
 ],
 'U4_C3': [
  ('4\nred rose rat ram\n2\nr ra', 'r: 4\nra: 2', 'sample'),
  ('3\nsky ski sketch\n3\nsk ski skyline', 'sk: 3\nski: 1\nskyline: 0', 'sample'),
 ],
 'U4_C4': [
  ('4\n8 5 10 3', 'Balance Factor: 1\nRotation: None', 'sample'),
  ('6\n60 40 80 30 50 20', 'Balance Factor: 2\nRotation: LL', 'sample'),
 ],
}

for k, code in CODE.items():
    with open(f'{S}/{k}.cpp', 'w') as f:
        f.write(code + '\n')
with open(f'{S}/tests_u4.json', 'w') as f:
    json.dump(TESTS, f, indent=1)
print('Unit 4 files written:', len(CODE))
