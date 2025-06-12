import time
import functools
from typing import Callable, Any

class PerformanceMonitor:
    """Monitor and track email processing performance"""
    
    def __init__(self):
        self.timings = {}
        self.call_counts = {}
    
    def time_function(self, func_name: str = None):
        """Decorator to time function execution"""
        def decorator(func: Callable) -> Callable:
            name = func_name or f"{func.__module__}.{func.__name__}"
            
            @functools.wraps(func)
            def wrapper(*args, **kwargs) -> Any:
                start_time = time.time()
                result = func(*args, **kwargs)
                end_time = time.time()
                
                execution_time = end_time - start_time
                
                if name not in self.timings:
                    self.timings[name] = []
                    self.call_counts[name] = 0
                
                self.timings[name].append(execution_time)
                self.call_counts[name] += 1
                
                print(f"⏱️ {name}: {execution_time:.2f}s")
                return result
            
            return wrapper
        return decorator
    
    def get_performance_report(self) -> dict:
        """Generate performance report"""
        report = {}
        
        for func_name, times in self.timings.items():
            if times:
                avg_time = sum(times) / len(times)
                total_time = sum(times)
                call_count = self.call_counts[func_name]
                
                report[func_name] = {
                    'avg_time': round(avg_time, 3),
                    'total_time': round(total_time, 3),
                    'call_count': call_count,
                    'min_time': round(min(times), 3),
                    'max_time': round(max(times), 3)
                }
        
        return report
    
    def print_performance_report(self):
        """Print formatted performance report"""
        report = self.get_performance_report()
        
        print("\n📊 PERFORMANCE REPORT")
        print("=" * 60)
        
        for func_name, stats in report.items():
            print(f"\n🔧 {func_name}")
            print(f"   Calls: {stats['call_count']}")
            print(f"   Total: {stats['total_time']}s")
            print(f"   Average: {stats['avg_time']}s")
            print(f"   Min: {stats['min_time']}s | Max: {stats['max_time']}s")
        
        # Calculate total processing time
        total_processing_time = sum(stats['total_time'] for stats in report.values())
        print(f"\n🚀 TOTAL PROCESSING TIME: {total_processing_time:.2f}s")
        print("=" * 60)

# Global monitor instance
performance_monitor = PerformanceMonitor()

def monitor_performance(func_name: str = None):
    """Decorator shorthand for performance monitoring"""
    return performance_monitor.time_function(func_name) 