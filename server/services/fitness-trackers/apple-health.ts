import { Request, Response } from 'express';

// Note: Apple Health integration mainly happens on the client-side iOS app
// using HealthKit. This server-side code handles data received from the client.

// Types for Apple Health data
interface AppleHealthData {
  type: string;
  unit: string;
  value: number;
  startDate: string;
  endDate: string;
  device?: string;
  source?: string;
}

interface AppleHealthUser {
  id: string;
  healthId?: string;
  dateOfBirth?: string;
  biologicalSex?: string;
  bloodType?: string;
}

// Process and store Apple Health data 
export async function processAppleHealthData(userId: string, data: AppleHealthData[]) {
  try {
    // Here we would normally:
    // 1. Validate the data
    // 2. Store it in a database
    // 3. Process it for insights
    
    console.log(`Processing ${data.length} Apple Health data points for user ${userId}`);
    
    // Return success with summary
    return {
      success: true,
      processedCount: data.length,
      summary: summarizeHealthData(data)
    };
  } catch (error) {
    console.error('Error processing Apple Health data:', error);
    return {
      success: false,
      error: 'Failed to process Apple Health data'
    };
  }
}

// Generate insights from Apple Health data
export function generateInsights(data: AppleHealthData[]) {
  // Group data by type
  const dataByType = data.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, AppleHealthData[]>);
  
  // Generate insights for each type
  const insights = Object.entries(dataByType).map(([type, items]) => {
    return generateInsightForType(type, items);
  });
  
  return insights.filter(insight => insight !== null);
}

// Express route handler for receiving Apple Health data
export async function handleAppleHealthSync(req: Request, res: Response) {
  try {
    const { userId, data } = req.body;
    
    if (!userId || !data || !Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request format. Required: userId and data array'
      });
    }
    
    const result = await processAppleHealthData(userId, data);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error
      });
    }
    
    const insights = generateInsights(data);
    
    res.json({
      success: true,
      summary: result.summary,
      insights
    });
  } catch (error) {
    console.error('Apple Health sync error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process Apple Health data'
    });
  }
}

// Helper function to summarize health data
function summarizeHealthData(data: AppleHealthData[]) {
  // Group data by type
  const dataByType = data.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, AppleHealthData[]>);
  
  // Create summary for each type
  const summary: Record<string, any> = {};
  
  for (const [type, items] of Object.entries(dataByType)) {
    // Calculate average value
    const totalValue = items.reduce((sum, item) => sum + item.value, 0);
    const avgValue = totalValue / items.length;
    
    // Find min and max values
    const values = items.map(item => item.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    // Get date range
    const startDates = items.map(item => new Date(item.startDate).getTime());
    const endDates = items.map(item => new Date(item.endDate).getTime());
    const earliestDate = new Date(Math.min(...startDates));
    const latestDate = new Date(Math.max(...endDates));
    
    summary[type] = {
      count: items.length,
      average: avgValue,
      min: minValue,
      max: maxValue,
      unit: items[0].unit,
      dateRange: {
        start: earliestDate.toISOString(),
        end: latestDate.toISOString()
      }
    };
  }
  
  return summary;
}

// Helper function to generate insights for a specific health data type
function generateInsightForType(type: string, data: AppleHealthData[]) {
  // Skip if not enough data points
  if (data.length < 3) {
    return null;
  }
  
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  const avgValue = totalValue / data.length;
  
  // Sort data by date
  const sortedData = [...data].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  
  // Calculate trend (simple linear regression)
  const trend = calculateTrend(sortedData);
  
  let insight = null;
  
  switch (type) {
    case 'HKQuantityTypeIdentifierStepCount':
      insight = generateStepCountInsight(avgValue, trend, sortedData);
      break;
    case 'HKQuantityTypeIdentifierActiveEnergyBurned':
      insight = generateCalorieInsight(avgValue, trend, sortedData);
      break;
    case 'HKQuantityTypeIdentifierHeartRate':
      insight = generateHeartRateInsight(avgValue, trend, sortedData);
      break;
    case 'HKCategoryTypeIdentifierSleepAnalysis':
      insight = generateSleepInsight(sortedData);
      break;
    default:
      insight = generateGenericInsight(type, avgValue, trend, sortedData);
  }
  
  return insight;
}

// Helper function to calculate trend (positive or negative)
function calculateTrend(data: AppleHealthData[]) {
  if (data.length < 2) return 0;
  
  const firstValue = data[0].value;
  const lastValue = data[data.length - 1].value;
  
  return lastValue > firstValue ? 1 : lastValue < firstValue ? -1 : 0;
}

// Helper functions to generate specific insights
function generateStepCountInsight(avg: number, trend: number, data: AppleHealthData[]) {
  const latestDay = data[data.length - 1];
  
  let message = '';
  
  if (avg < 5000) {
    message = 'Your step count is below the recommended 10,000 steps per day. Try to increase your daily activity.';
  } else if (avg < 10000) {
    message = 'You\'re getting close to the recommended 10,000 steps per day. Keep it up!';
  } else {
    message = 'Great job! You\'re meeting or exceeding the recommended daily step count.';
  }
  
  if (trend > 0) {
    message += ' Your step count is trending upward, which is excellent progress!';
  } else if (trend < 0) {
    message += ' Your step count has been decreasing. Try to maintain or increase your activity level.';
  }
  
  return {
    type: 'steps',
    message,
    data: {
      average: Math.round(avg),
      trend,
      latest: Math.round(latestDay.value)
    }
  };
}

function generateCalorieInsight(avg: number, trend: number, data: AppleHealthData[]) {
  let message = `You're burning an average of ${Math.round(avg)} calories through activity daily.`;
  
  if (trend > 0) {
    message += ' Your calorie burn is trending upward, indicating increased activity levels.';
  } else if (trend < 0) {
    message += ' Your calorie burn has been decreasing. Consider increasing your activity level.';
  }
  
  return {
    type: 'calories',
    message,
    data: {
      average: Math.round(avg),
      trend
    }
  };
}

function generateHeartRateInsight(avg: number, trend: number, data: AppleHealthData[]) {
  let message = `Your average heart rate is ${Math.round(avg)} bpm.`;
  
  const restingHeartRate = calculateRestingHeartRate(data);
  if (restingHeartRate) {
    message += ` Your estimated resting heart rate is ${Math.round(restingHeartRate)} bpm.`;
    
    if (restingHeartRate < 60) {
      message += ' This is excellent and indicates good cardiovascular fitness.';
    } else if (restingHeartRate < 70) {
      message += ' This is a good resting heart rate for most adults.';
    } else if (restingHeartRate < 80) {
      message += ' This is an average resting heart rate. Regular exercise can help lower it.';
    } else {
      message += ' This is slightly elevated. Regular cardiovascular exercise can help lower your resting heart rate.';
    }
  }
  
  return {
    type: 'heartRate',
    message,
    data: {
      average: Math.round(avg),
      restingHeartRate: restingHeartRate ? Math.round(restingHeartRate) : null,
      trend
    }
  };
}

function generateSleepInsight(data: AppleHealthData[]) {
  // Calculate average sleep duration
  const sleepDurations = data.map(item => {
    const start = new Date(item.startDate).getTime();
    const end = new Date(item.endDate).getTime();
    return (end - start) / (1000 * 60 * 60); // hours
  });
  
  const avgSleepDuration = sleepDurations.reduce((sum, hours) => sum + hours, 0) / sleepDurations.length;
  
  let message = `You're averaging ${avgSleepDuration.toFixed(1)} hours of sleep per night.`;
  
  if (avgSleepDuration < 6) {
    message += ' This is below the recommended 7-9 hours for adults. Insufficient sleep can impact recovery and performance.';
  } else if (avgSleepDuration < 7) {
    message += ' This is slightly below the recommended 7-9 hours for adults. Try to get a bit more sleep when possible.';
  } else if (avgSleepDuration <= 9) {
    message += ' This is within the recommended range of 7-9 hours for adults. Good job!';
  } else {
    message += ' This is above the typical recommendation of 7-9 hours for adults, which is fine if you feel well-rested.';
  }
  
  return {
    type: 'sleep',
    message,
    data: {
      averageHours: parseFloat(avgSleepDuration.toFixed(1))
    }
  };
}

function generateGenericInsight(type: string, avg: number, trend: number, data: AppleHealthData[]) {
  let readableType = type.replace(/HKQuantityTypeIdentifier|HKCategoryTypeIdentifier/, '')
    .replace(/([A-Z])/g, ' $1')
    .trim();
  
  let message = `Your average ${readableType} is ${avg.toFixed(1)} ${data[0].unit}.`;
  
  if (trend > 0) {
    message += ` Your ${readableType} has been increasing.`;
  } else if (trend < 0) {
    message += ` Your ${readableType} has been decreasing.`;
  }
  
  return {
    type: readableType.toLowerCase().replace(/\s+/g, '_'),
    message,
    data: {
      average: parseFloat(avg.toFixed(1)),
      unit: data[0].unit,
      trend
    }
  };
}

// Helper function to estimate resting heart rate from heart rate data
function calculateRestingHeartRate(heartRateData: AppleHealthData[]) {
  if (heartRateData.length < 5) return null;
  
  // Sort heart rate values
  const rates = heartRateData.map(item => item.value).sort((a, b) => a - b);
  
  // Take the average of the lowest 10% of heart rate values as an estimate of resting heart rate
  const lowestCount = Math.max(1, Math.floor(rates.length * 0.1));
  const lowestRates = rates.slice(0, lowestCount);
  
  return lowestRates.reduce((sum, rate) => sum + rate, 0) / lowestRates.length;
}