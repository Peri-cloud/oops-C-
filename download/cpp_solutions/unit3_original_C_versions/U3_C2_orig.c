#include <stdio.h>
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
    printf("\n");
    return 0;
}
