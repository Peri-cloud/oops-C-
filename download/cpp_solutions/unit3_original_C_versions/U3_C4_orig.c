#include <stdio.h>
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
        printf("Not Found\n");
    } else {
        printf("Found at depth %d\n", depth);
    }
    return 0;
}
