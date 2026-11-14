#include <iostream>
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
}
