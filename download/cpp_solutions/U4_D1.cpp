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
}
