#include <iostream>
using namespace std;
int main() {
    int g[4][4] = {{0,1,1,0},{1,0,1,1},{1,1,0,0},{0,1,0,0}};
    int deg[4] = {0};
    for (int i = 0; i < 4; i++)
        for (int j = 0; j < 4; j++)
            deg[i] += g[i][j];
    for (int i = 0; i < 4; i++)
        cout << deg[i] << " ";
    return 0;
}
