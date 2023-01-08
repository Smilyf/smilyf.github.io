#include <iostream>
#include <thread> // 标准C++库中对多线程支持的头文件
void do_something_in_current_thread()
{
	std::cout << "do_something." << std::endl;
}
void fun1(int x)
{
	std::cout << x << std::endl;
}
void fun2()
{
	int some_local_state = 0;
	std::thread t(fun1, some_local_state);
	t.detach();

}
int main()
{
	fun2();
	return 0;
}

