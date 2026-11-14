#include <stdio.h>
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
    for (int i = 0; s[i] != '\0'; i++) {
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
    printf("\n");
    return 0;
}
