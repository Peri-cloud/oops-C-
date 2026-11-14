#include <iostream>
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
}
