#include <iostream>
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
    for (int i = 0; s[i] != '\0'; i++) {
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
}
