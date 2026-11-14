#include <iostream>
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
}
