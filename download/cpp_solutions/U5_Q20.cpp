#include <iostream>
using namespace std;
int g[5][5] = {{0,1,1,0,0},{1,0,0,0,1},{1,0,0,1,0},{0,0,1,0,1},{0,1,0,1,0}};
bool visited[5];
void dfs(int v) {
    visited[v] = true;
    cout << v << " ";
    for (int i = 0; i < 5; i++)
        if (g[v][i] && !visited[i])
            dfs(i);
}
int main() {
    dfs(2);
    return 0;
}
