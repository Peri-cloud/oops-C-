#!/usr/bin/env python3
"""Unit 3: write QB solutions. Debugging = C++ as given. COD = original C (verified with gcc)
plus C++17 conversions (verified with g++). Tests JSON included."""
import json, os

S = '/home/z/my-project/scripts/solutions'

CODE = {}

CODE['U3_D1'] = '''#include <iostream>
using namespace std;
struct Node {
    int data;
    Node* next;
};
Node* insertEnd(Node* head, int value) {
    Node* newNode = new Node;
    newNode->data = value;
    newNode->next = NULL;
    if (head == NULL) {
        return newNode;
    }
    Node* temp = head;
    while (temp->next != NULL) {
        temp = temp->next;
    }
    temp->next = newNode;
    return head;
}
Node* reverseList(Node* head) {
    Node* prev = NULL;
    Node* curr = head;
    while (curr != NULL) {
        Node* nextNode = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextNode;
    }
    return prev;
}
void display(Node* head) {
    Node* temp = head;
    while (temp != NULL) {
        cout << temp->data;
        if (temp->next != NULL) {
            cout << " ";
        }
        temp = temp->next;
    }
    cout << endl;
}
int main() {
    int n;
    cin >> n;
    Node* head = NULL;
    for (int i = 0; i < n; i++) {
        int value;
        cin >> value;
        head = insertEnd(head, value);
    }
    cout << "Original: ";
    display(head);
    head = reverseList(head);
    cout << "Reversed: ";
    display(head);
    return 0;
}'''

CODE['U3_D2'] = '''#include <iostream>
using namespace std;
class CircularQueue {
    int arr[100];
    int capacity;
    int front;
    int rear;
    int count;
public:
    CircularQueue(int c) {
        capacity = c;
        front = 0;
        rear = -1;
        count = 0;
    }
    void process(int type, int value) {
        if (type == 1) {
            if (count == capacity) {
                cout << "Queue Full" << endl;
                return;
            }
            rear = (rear + 1) % capacity;
            arr[rear] = value;
            count = count + 1;
            cout << "Enqueued " << value << endl;
        } else {
            if (count == 0) {
                cout << "Queue Empty" << endl;
                return;
            }
            cout << "Dequeued " << arr[front] << endl;
            front = (front + 1) % capacity;
            count = count - 1;
        }
    }
    void show() {
        if (count == 0) {
            cout << "Queue: Empty" << endl;
            return;
        }
        cout << "Queue:";
        for (int i = 0; i < count; i++) {
            cout << " " << arr[(front + i) % capacity];
        }
        cout << endl;
    }
};
int main() {
    int c, n;
    cin >> c >> n;
    CircularQueue q(c);
    for (int i = 0; i < n; i++) {
        int type, value;
        cin >> type >> value;
        q.process(type, value);
    }
    q.show();
    return 0;
}'''

CODE['U3_D3'] = '''#include <iostream>
using namespace std;
struct Node {
    int data;
    Node* next;
};
Node* insertEnd(Node* head, int value) {
    Node* newNode = new Node;
    newNode->data = value;
    if (head == NULL) {
        newNode->next = newNode;
        return newNode;
    }
    Node* temp = head;
    while (temp->next != head) {
        temp = temp->next;
    }
    temp->next = newNode;
    newNode->next = head;
    return head;
}
int valueAfterSteps(Node* head, int steps) {
    Node* temp = head;
    for (int i = 0; i < steps; i++) {
        temp = temp->next;
    }
    return temp->data;
}
int main() {
    int n, steps;
    cin >> n;
    Node* head = NULL;
    for (int i = 0; i < n; i++) {
        int value;
        cin >> value;
        head = insertEnd(head, value);
    }
    cin >> steps;
    cout << "Value After Steps: " << valueAfterSteps(head, steps) << endl;
    return 0;
}'''

CODE['U3_D4'] = '''#include <iostream>
#include <string>
using namespace std;
int evaluate(string expr) {
    int stack[50];
    int top = -1;
    for (int i = 0; i < expr.length(); i++) {
        char c = expr[i];
        if (c >= '0' && c <= '9') {
            top = top + 1;
            stack[top] = c - '0';
        } else {
            int b = stack[top];
            top = top - 1;
            int a = stack[top];
            top = top - 1;
            int result = 0;
            if (c == '+') {
                result = a + b;
            } else if (c == '-') {
                result = a - b;
            } else if (c == '*') {
                result = a * b;
            } else {
                result = a / b;
            }
            top = top + 1;
            stack[top] = result;
        }
    }
    return stack[top];
}
int main() {
    string expr;
    cin >> expr;
    cout << "Result: " << evaluate(expr) << endl;
    return 0;
}'''

CODE['U3_D5'] = '''#include <iostream>
using namespace std;
struct Node {
    int data;
    Node* prev;
    Node* next;
};
void insertFront(Node*& head, Node*& tail, int value) {
    Node* newNode = new Node;
    newNode->data = value;
    newNode->prev = NULL;
    newNode->next = head;
    if (head == NULL) {
        tail = newNode;
    } else {
        head->prev = newNode;
    }
    head = newNode;
}
void printForward(Node* head) {
    cout << "Forward:";
    Node* temp = head;
    while (temp != NULL) {
        cout << " " << temp->data;
        temp = temp->next;
    }
    cout << endl;
}
void printBackward(Node* tail) {
    cout << "Backward:";
    Node* temp = tail;
    while (temp != NULL) {
        cout << " " << temp->data;
        temp = temp->prev;
    }
    cout << endl;
}
int main() {
    int n;
    cin >> n;
    Node* head = NULL;
    Node* tail = NULL;
    for (int i = 0; i < n; i++) {
        int value;
        cin >> value;
        insertFront(head, tail, value);
    }
    printForward(head);
    printBackward(tail);
    return 0;
}'''

# ---- COD: original C solutions as printed in the QB ----
CODE_C = {}

CODE_C['U3_C1'] = '''#include <stdio.h>
int n;
int a[105];
int res[105];
int cnt;
void preorder(int i) {
    if (i >= n) {
        return;
    }
    res[cnt++] = a[i];
    preorder(2 * i + 1);
    preorder(2 * i + 2);
}
void inorder(int i) {
    if (i >= n) {
        return;
    }
    inorder(2 * i + 1);
    res[cnt++] = a[i];
    inorder(2 * i + 2);
}
void postorder(int i) {
    if (i >= n) {
        return;
    }
    postorder(2 * i + 1);
    postorder(2 * i + 2);
    res[cnt++] = a[i];
}
void show(char *label) {
    printf("%s:", label);
    for (int i = 0; i < cnt; i++) {
        printf(" %d", res[i]);
    }
    printf("\\n");
}
int main() {
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
    }
    cnt = 0;
    preorder(0);
    show("Preorder");
    cnt = 0;
    inorder(0);
    show("Inorder");
    cnt = 0;
    postorder(0);
    show("Postorder");
    return 0;
}'''

CODE_C['U3_C2'] = '''#include <stdio.h>
int main() {
    int n;
    int h[105];
    int size = 0;
    scanf("%d", &n);
    for (int k = 0; k < n; k++) {
        int x;
        scanf("%d", &x);
        h[size] = x;
        int i = size;
        size++;
        while (i > 0 && h[(i - 1) / 2] > h[i]) {
            int parent = (i - 1) / 2;
            int temp = h[parent];
            h[parent] = h[i];
            h[i] = temp;
            i = parent;
        }
    }
    printf("Min-Heap:");
    for (int i = 0; i < size; i++) {
        printf(" %d", h[i]);
    }
    printf("\\n");
    return 0;
}'''

CODE_C['U3_C3'] = '''#include <stdio.h>
#include <stdlib.h>
struct Node {
    char data;
    struct Node *left;
    struct Node *right;
};
struct Node *newNode(char c) {
    struct Node *node = (struct Node *)malloc(sizeof(struct Node));
    node->data = c;
    node->left = NULL;
    node->right = NULL;
    return node;
}
void printInfix(struct Node *root) {
    if (root == NULL) {
        return;
    }
    if (root->left == NULL && root->right == NULL) {
        printf("%c", root->data);
        return;
    }
    printf("(");
    printInfix(root->left);
    printf("%c", root->data);
    printInfix(root->right);
    printf(")");
}
int main() {
    char s[55];
    struct Node *stack[55];
    int top = -1;
    scanf("%s", s);
    for (int i = 0; s[i] != '\\0'; i++) {
        char c = s[i];
        struct Node *node = newNode(c);
        if (c < 'a' || c > 'z') {
            node->right = stack[top];
            top--;
            node->left = stack[top];
            top--;
        }
        top++;
        stack[top] = node;
    }
    printf("Infix Expression: ");
    printInfix(stack[top]);
    printf("\\n");
    return 0;
}'''

CODE_C['U3_C4'] = '''#include <stdio.h>
#include <stdlib.h>
struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};
struct Node *insert(struct Node *root, int x) {
    if (root == NULL) {
        struct Node *node = (struct Node *)malloc(sizeof(struct Node));
        node->data = x;
        node->left = NULL;
        node->right = NULL;
        return node;
    }
    if (x < root->data) {
        root->left = insert(root->left, x);
    } else {
        root->right = insert(root->right, x);
    }
    return root;
}
int main() {
    int n, key;
    struct Node *root = NULL;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        int x;
        scanf("%d", &x);
        root = insert(root, x);
    }
    scanf("%d", &key);
    struct Node *curr = root;
    int depth = 0;
    while (curr != NULL && curr->data != key) {
        if (key < curr->data) {
            curr = curr->left;
        } else {
            curr = curr->right;
        }
        depth++;
    }
    if (curr == NULL) {
        printf("Not Found\\n");
    } else {
        printf("Found at depth %d\\n", depth);
    }
    return 0;
}'''

# ---- COD: C++17 conversions (same logic) ----
CODE['U3_C1'] = '''#include <iostream>
using namespace std;
int n;
int a[105];
int res[105];
int cnt;
void preorder(int i) {
    if (i >= n) {
        return;
    }
    res[cnt++] = a[i];
    preorder(2 * i + 1);
    preorder(2 * i + 2);
}
void inorder(int i) {
    if (i >= n) {
        return;
    }
    inorder(2 * i + 1);
    res[cnt++] = a[i];
    inorder(2 * i + 2);
}
void postorder(int i) {
    if (i >= n) {
        return;
    }
    postorder(2 * i + 1);
    postorder(2 * i + 2);
    res[cnt++] = a[i];
}
void show(const char *label) {
    cout << label << ":";
    for (int i = 0; i < cnt; i++) {
        cout << " " << res[i];
    }
    cout << endl;
}
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    cnt = 0;
    preorder(0);
    show("Preorder");
    cnt = 0;
    inorder(0);
    show("Inorder");
    cnt = 0;
    postorder(0);
    show("Postorder");
    return 0;
}'''

CODE['U3_C2'] = '''#include <iostream>
using namespace std;
int main() {
    int n;
    int h[105];
    int size = 0;
    cin >> n;
    for (int k = 0; k < n; k++) {
        int x;
        cin >> x;
        h[size] = x;
        int i = size;
        size++;
        while (i > 0 && h[(i - 1) / 2] > h[i]) {
            int parent = (i - 1) / 2;
            int temp = h[parent];
            h[parent] = h[i];
            h[i] = temp;
            i = parent;
        }
    }
    cout << "Min-Heap:";
    for (int i = 0; i < size; i++) {
        cout << " " << h[i];
    }
    cout << endl;
    return 0;
}'''

CODE['U3_C3'] = '''#include <iostream>
using namespace std;
struct Node {
    char data;
    Node *left;
    Node *right;
};
Node *newNode(char c) {
    Node *node = new Node;
    node->data = c;
    node->left = NULL;
    node->right = NULL;
    return node;
}
void printInfix(Node *root) {
    if (root == NULL) {
        return;
    }
    if (root->left == NULL && root->right == NULL) {
        cout << root->data;
        return;
    }
    cout << "(";
    printInfix(root->left);
    cout << root->data;
    printInfix(root->right);
    cout << ")";
}
int main() {
    char s[55];
    Node *stk[55];
    int top = -1;
    cin >> s;
    for (int i = 0; s[i] != '\\0'; i++) {
        char c = s[i];
        Node *node = newNode(c);
        if (c < 'a' || c > 'z') {
            node->right = stk[top];
            top--;
            node->left = stk[top];
            top--;
        }
        top++;
        stk[top] = node;
    }
    cout << "Infix Expression: ";
    printInfix(stk[top]);
    cout << endl;
    return 0;
}'''

CODE['U3_C4'] = '''#include <iostream>
using namespace std;
struct Node {
    int data;
    Node *left;
    Node *right;
};
Node *insert(Node *root, int x) {
    if (root == NULL) {
        Node *node = new Node;
        node->data = x;
        node->left = NULL;
        node->right = NULL;
        return node;
    }
    if (x < root->data) {
        root->left = insert(root->left, x);
    } else {
        root->right = insert(root->right, x);
    }
    return root;
}
int main() {
    int n, key;
    Node *root = NULL;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        root = insert(root, x);
    }
    cin >> key;
    Node *curr = root;
    int depth = 0;
    while (curr != NULL && curr->data != key) {
        if (key < curr->data) {
            curr = curr->left;
        } else {
            curr = curr->right;
        }
        depth++;
    }
    if (curr == NULL) {
        cout << "Not Found" << endl;
    } else {
        cout << "Found at depth " << depth << endl;
    }
    return 0;
}'''

TESTS = {
 'U3_D1': [
  ('4\n3 1 4 2', 'Original: 3 1 4 2\nReversed: 2 4 1 3', 'sample'),
  ('2\n9 6', 'Original: 9 6\nReversed: 6 9', 'sample'),
  ('1\n7', 'Original: 7\nReversed: 7', 'hidden'),
  ('3\n5 10 15', 'Original: 5 10 15\nReversed: 15 10 5', 'hidden'),
  ('5\n4 8 15 16 23', 'Original: 4 8 15 16 23\nReversed: 23 16 15 8 4', 'hidden'),
  ('6\n12 7 33 2 91 40', 'Original: 12 7 33 2 91 40\nReversed: 40 91 2 33 7 12', 'hidden'),
 ],
 'U3_D2': [
  ('3 5\n1 8\n1 9\n1 7\n1 6\n2 0', 'Enqueued 8\nEnqueued 9\nEnqueued 7\nQueue Full\nDequeued 8\nQueue: 9 7', 'sample'),
  ('2 4\n1 4\n2 0\n1 2\n1 3', 'Enqueued 4\nDequeued 4\nEnqueued 2\nEnqueued 3\nQueue: 2 3', 'sample'),
  ('3 4\n1 10\n1 20\n2 0\n1 30', 'Enqueued 10\nEnqueued 20\nDequeued 10\nEnqueued 30\nQueue: 20 30', 'hidden'),
  ('2 3\n2 0\n1 5\n2 0', 'Queue Empty\nEnqueued 5\nDequeued 5\nQueue: Empty', 'hidden'),
  ('3 8\n1 1\n1 2\n1 3\n1 4\n2 0\n1 5\n1 6\n2 0', 'Enqueued 1\nEnqueued 2\nEnqueued 3\nQueue Full\nDequeued 1\nEnqueued 5\nQueue Full\nDequeued 2\nQueue: 3 5', 'hidden'),
  ('4 10\n1 11\n1 22\n1 33\n2 0\n2 0\n1 44\n1 55\n1 66\n1 77\n2 0', 'Enqueued 11\nEnqueued 22\nEnqueued 33\nDequeued 11\nDequeued 22\nEnqueued 44\nEnqueued 55\nEnqueued 66\nQueue Full\nDequeued 33\nQueue: 44 55 66', 'hidden'),
 ],
 'U3_D3': [
  ('4\n3 6 9 12\n5', 'Value After Steps: 6', 'sample'),
  ('6\n2 4 6 8 10 12\n9', 'Value After Steps: 8', 'sample'),
  ('3\n10 20 30\n0', 'Value After Steps: 10', 'hidden'),
  ('3\n7 14 21\n4', 'Value After Steps: 14', 'hidden'),
  ('4\n5 15 25 35\n6', 'Value After Steps: 25', 'hidden'),
  ('5\n11 22 33 44 55\n13', 'Value After Steps: 44', 'hidden'),
 ],
 'U3_D4': [
  ('234*+', 'Result: 14', 'sample'),
  ('92-3*', 'Result: 21', 'sample'),
  ('23+', 'Result: 5', 'hidden'),
  ('93-', 'Result: 6', 'hidden'),
  ('531*+9-', 'Result: -1', 'hidden'),
  ('82/34-*', 'Result: -4', 'hidden'),
 ],
 'U3_D5': [
  ('4\n1 2 3 4', 'Forward: 4 3 2 1\nBackward: 1 2 3 4', 'sample'),
  ('2\n15 25', 'Forward: 25 15\nBackward: 15 25', 'sample'),
  ('1\n8', 'Forward: 8\nBackward: 8', 'hidden'),
  ('3\n10 20 30', 'Forward: 30 20 10\nBackward: 10 20 30', 'hidden'),
  ('5\n7 3 9 1 5', 'Forward: 5 1 9 3 7\nBackward: 7 3 9 1 5', 'hidden'),
  ('6\n21 22 23 24 25 26', 'Forward: 26 25 24 23 22 21\nBackward: 21 22 23 24 25 26', 'hidden'),
 ],
 'U3_C1': [
  ('4\n15 10 20 5', 'Preorder: 15 10 5 20\nInorder: 5 10 15 20\nPostorder: 5 10 20 15', 'sample'),
  ('6\n2 4 6 8 10 12', 'Preorder: 2 4 8 10 6 12\nInorder: 8 4 10 2 12 6\nPostorder: 8 10 4 12 6 2', 'sample'),
  ('7\n1 2 3 4 5 6 7', 'Preorder: 1 2 4 5 3 6 7\nInorder: 4 2 5 1 6 3 7\nPostorder: 4 5 2 6 7 3 1', 'hidden'),
  ('1\n10', 'Preorder: 10\nInorder: 10\nPostorder: 10', 'hidden'),
  ('3\n5 3 8', 'Preorder: 5 3 8\nInorder: 3 5 8\nPostorder: 3 8 5', 'hidden'),
  ('5\n1 2 3 4 5', 'Preorder: 1 2 4 5 3\nInorder: 4 2 5 1 3\nPostorder: 4 5 2 3 1', 'hidden'),
 ],
 'U3_C2': [
  ('4\n12 7 3 9', 'Min-Heap: 3 9 7 12', 'sample'),
  ('5\n20 15 10 5 1', 'Min-Heap: 1 5 15 20 10', 'sample'),
  ('5\n5 3 8 1 2', 'Min-Heap: 1 2 8 5 3', 'hidden'),
  ('1\n7', 'Min-Heap: 7', 'hidden'),
  ('4\n4 3 2 1', 'Min-Heap: 1 2 3 4', 'hidden'),
  ('6\n10 20 30 40 50 60', 'Min-Heap: 10 20 30 40 50 60', 'hidden'),
 ],
 'U3_C3': [
  ('xy-', 'Infix Expression: (x-y)', 'sample'),
  ('pqr+-', 'Infix Expression: (p-(q+r))', 'sample'),
  ('ab+', 'Infix Expression: (a+b)', 'hidden'),
  ('ab+c*', 'Infix Expression: ((a+b)*c)', 'hidden'),
  ('abc+*', 'Infix Expression: (a*(b+c))', 'hidden'),
  ('a', 'Infix Expression: a', 'hidden'),
 ],
 'U3_C4': [
  ('5\n30 20 40 10 25\n25', 'Found at depth 2', 'sample'),
  ('3\n5 2 8\n9', 'Not Found', 'sample'),
  ('7\n50 30 70 20 40 60 80\n60', 'Found at depth 2', 'hidden'),
  ('1\n10\n10', 'Found at depth 0', 'hidden'),
  ('5\n40 20 60 10 30\n55', 'Not Found', 'hidden'),
  ('6\n10 20 30 40 50 60\n60', 'Found at depth 5', 'hidden'),
 ],
}

for k, code in CODE.items():
    with open(f'{S}/{k}.cpp', 'w') as f:
        f.write(code + '\n')
for k, code in CODE_C.items():
    with open(f'{S}/{k}_orig.c', 'w') as f:
        f.write(code + '\n')
with open(f'{S}/tests_u3.json', 'w') as f:
    json.dump(TESTS, f, indent=1)
print('Unit 3 files written:', len(CODE), 'cpp +', len(CODE_C), 'c-originals')
